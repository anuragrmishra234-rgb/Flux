/**
 * background.js v2.1
 * New features:
 *  - Persistent Connection (chrome.alarms wake-up)
 *  - Tab deduplication (focus existing tab instead of opening duplicate)
 *  - Desktop notifications on context activation
 *  - Session timer stored in chrome.storage
 *  - Richer logging and error handling
 */
import { io } from './socket.io.esm.min.js';

console.log("Context Switcher v2.1 loaded.");

let socket = null;
let heartbeatInterval = null;

/**
 * Initialize Socket Connection
 */
function initSocket() {
  if (socket && socket.connected) return;

  socket = io('http://localhost:5001', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('✅ Extension connected:', socket.id);
    socket.emit('extension_log', 'EXT_READY: Connected to Backend (SW WAKE)');
    chrome.storage.local.set({ socketConnected: true, socketId: socket.id });
    
    // Resume heartbeat on connect
    startHeartbeat();
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Connection error:', err.message);
    chrome.storage.local.set({ socketConnected: false });
  });

  socket.on('disconnect', (reason) => {
    console.log('⚠️ Disconnected:', reason);
    chrome.storage.local.set({ socketConnected: false });
    if (heartbeatInterval) clearInterval(heartbeatInterval);
  });

  // Handle incoming context triggers
  socket.on('trigger_extension_context', handleContextTrigger);
  
  // Handle user sync
  socket.on('trigger_extension_sync', (payload) => {
    if (payload.userId) {
      chrome.storage.local.set({ userId: payload.userId });
      console.log('✅ Extension Synced: ID ' + payload.userId);
    }
  });
}

/**
 * Keep MV3 service worker "activeish"
 */
function setupKeepAlive() {
  chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('⏰ Keep-alive alarm triggered — ensuring connection...');
    initSocket();
    // Use an API call to keep worker alive for a few more seconds
    chrome.runtime.getPlatformInfo(() => {});
  }
});

// Listener for startup events
chrome.runtime.onStartup.addListener(() => {
  console.log('🚀 Browser started — initializing connection...');
  initSocket();
  setupKeepAlive();
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('✨ Extension installed/updated — initializing...');
  initSocket();
  setupKeepAlive();
});

// Respond to popup status requests or force sync
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get_status') {
    chrome.storage.local.get(['socketConnected', 'socketId', 'activeContext', 'timerEnd'], (data) => {
      sendResponse({
        connected: data.socketConnected || false,
        id: data.socketId || 'N/A',
        activeContext: data.activeContext || null,
        timerEnd: data.timerEnd || null
      });
    });
    return true; // async
  }

  if (request.action === 'force_sync') {
    console.log('🔄 Manual sync requested...');
    initSocket();
    sendResponse({ success: true });
    return true;
  }
});

/**
 * Smart tab opener — focuses existing tab if URL already open,
 * otherwise creates a new one.
 */
async function smartOpenUrl(url) {
  try {
    const pattern = url.replace(/\/$/, '') + '*';
    const existing = await chrome.tabs.query({ url: pattern });
    if (existing && existing.length > 0) {
      await chrome.tabs.update(existing[0].id, { active: true });
      return false; // not new
    } else {
      await chrome.tabs.create({ url });
      return true; // new
    }
  } catch {
    await chrome.tabs.create({ url });
    return true;
  }
}

/**
 * Show a rich desktop notification
 */
function showNotification(contextName, urls) {
  const urlCount = urls.length;
  chrome.notifications.create(`ctx_${Date.now()}`, {
    type: 'basic',
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjM2NmYxIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTEzIDEwVjNMNCAzMWg3djdsMTEtMTFoLTd6Ii8+PC9zdmc+',
    title: `🚀 ${contextName} Activated!`,
    message: `${urlCount} tab${urlCount !== 1 ? 's' : ''} ${urlCount !== 1 ? 'are' : 'is'} ready in your workspace.`,
    priority: 1
  });
}

/**
 * Main activation handler
 */
async function handleContextTrigger(payload) {
  console.log('🔔 TRIGGER RECEIVED:', payload.name);
  if (socket) socket.emit('extension_log', `EXT_ACTIVATE: ${payload.name} (FocusMode: ${payload.focusMode})`);

  try {
    const { urls, focusMode, name, color = '#6366f1' } = payload;

    if (focusMode) {
      console.log('🧹 FOCUS MODE: Purging all tabs except dashboard...');
      const currentTabs = await chrome.tabs.query({ currentWindow: true });
      const tabIdsToClose = currentTabs
        .filter(tab => !tab.url.startsWith('http://localhost:5173'))
        .map(tab => tab.id);

      if (tabIdsToClose.length > 0) await chrome.tabs.remove(tabIdsToClose);

      if (urls && urls.length > 0) {
        for (const url of urls) await chrome.tabs.create({ url });
      }
    } else {
      for (const url of urls) await smartOpenUrl(url);
    }

    const timerEnd = Date.now() + 25 * 60 * 1000;
    chrome.storage.local.set({
      activeContext: { name, color, urls, activatedAt: Date.now() },
      timerEnd
    });

    if (payload.userId) chrome.storage.local.set({ userId: payload.userId });

    showNotification(name, urls);
    if (socket) socket.emit('extension_log', 'EXT_SUCCESS: Context applied');
  } catch (err) {
    console.error('Extension Error:', err);
    if (socket) socket.emit('extension_log', 'EXT_ERROR: ' + err.message);
  }
}

/**
 * HEARTBEAT SYSTEM
 */
function startHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  
  heartbeatInterval = setInterval(() => {
    chrome.storage.local.get(['userId', 'socketConnected'], (data) => {
      if (!data.userId || !data.socketConnected || !socket || !socket.connected) return;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url) {
          socket.emit('heartbeat', {
            userId: data.userId,
            current_tab_url: tabs[0].url,
            page_title: tabs[0].title || ''
          });
        }
      });
    });
  }, 30000);
}

// Initial Call
initSocket();
setupKeepAlive();



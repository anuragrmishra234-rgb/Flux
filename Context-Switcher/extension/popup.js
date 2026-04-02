/**
 * popup.js v2.1
 * Shows connection status, active context name, Pomodoro timer, and URL list.
 */

const POMODORO_DURATION = 25 * 60 * 1000; // 25 minutes in ms

function hexToRgb(hex) {
  if (!hex) return '99, 102, 241';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function formatTime(ms) {
  if (ms <= 0) return '00:00';
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function getHostname(url) {
  try { return new URL(url).hostname; } catch { return url; }
}

function renderContent(data) {
  const content = document.getElementById('content');
  const indicator = document.getElementById('indicator');
  const statusText = document.getElementById('status-text');

  if (data.connected) {
    indicator.className = 'dot online';
    statusText.textContent = 'Connected';
    statusText.className = 'status-label online';
  } else {
    indicator.className = 'dot offline';
    statusText.textContent = 'Offline';
    statusText.className = 'status-label offline';
  }

  // Render main content area
  if (data.activeContext) {
    const ctx = data.activeContext;
    const color = ctx.color || '#6366f1';
    const rgb = hexToRgb(color);

    const now = Date.now();
    const remaining = data.timerEnd ? data.timerEnd - now : 0;
    const pct = data.timerEnd ? Math.max(0, Math.min(100, (remaining / POMODORO_DURATION) * 100)) : 0;
    const isDone = remaining <= 0;

    const chips = (ctx.urls || []).slice(0, 5).map(url =>
      `<span class="url-chip" title="${url}">${getHostname(url)}</span>`
    ).join('');
    const extra = ctx.urls && ctx.urls.length > 5 ? `<span class="url-chip">+${ctx.urls.length - 5}</span>` : '';

    content.innerHTML = `
      <div class="active-card" style="
        background: rgba(${rgb}, 0.08);
        border-color: rgba(${rgb}, 0.3);
      ">
        <div class="active-card::before" style="background: ${color};"></div>
        <div class="active-card-label">⚡ Active Workspace</div>
        <div class="active-name">
          <span class="active-icon">${ctx.icon || '⚡'}</span>
          <span style="color: #f1f5f9;">${ctx.name}</span>
        </div>
        <div class="timer-section">
          <div class="timer-bar-bg">
            <div class="timer-bar-fill" id="timer-fill" style="width: ${pct}%; background: linear-gradient(90deg, ${color}, #06b6d4);"></div>
          </div>
          <span class="timer-text ${isDone ? 'timer-done' : ''}" id="timer-display">
            ${isDone ? '🍅 Done!' : formatTime(remaining)}
          </span>
        </div>
      </div>
      <div class="url-list">${chips}${extra}</div>
    `;
  } else {
    content.innerHTML = `
      <div class="idle-state">
        <div class="idle-icon">🎯</div>
        <p>No active workspace.<br>Activate one from the<br><b style="color:#6366f1">Command Center</b>.</p>
      </div>
    `;
  }
}

function updatePopup() {
  chrome.runtime.sendMessage({ action: 'get_status' }, (response) => {
    if (chrome.runtime.lastError) {
       renderContent({ connected: false });
       return;
    }
    renderContent(response || { connected: false });
  });
}

// Handle Sync Button
document.getElementById('sync-btn')?.addEventListener('click', () => {
  const btn = document.getElementById('sync-btn');
  btn.innerHTML = 'Syncing...';
  chrome.runtime.sendMessage({ action: 'force_sync' }, () => {
    setTimeout(() => {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke-linecap="round" stroke-linejoin="round"/>
        </svg> Sync`;
      updatePopup();
    }, 1000);
  });
});

// Update every second for live timer
setInterval(updatePopup, 1000);
updatePopup();


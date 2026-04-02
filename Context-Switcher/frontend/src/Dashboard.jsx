import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import fluxLogo from './assets/flux-logo.png';
import { 
  Plus, 
  Trash2, 
  Zap, 
  LogOut, 
  Search, 
  Download, 
  Upload, 
  Check, 
  X, 
  Settings, 
  Globe, 
  Cpu, 
  Book, 
  Code, 
  Terminal, 
  Ghost,
  MoreVertical,
  Activity,
  History,
  Timer,
  Sparkles
} from 'lucide-react';

const socket = io('https://flux-k6pb.onrender.com', {
  transports: ['websocket']
});

socket.on('connect', () => console.log('✅ FRONTEND SOCKET CONNECTED:', socket.id));
socket.on('connect_error', (err) => console.error('❌ FRONTEND SOCKET ERROR:', err.message));

const COLORS = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Rose
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

const ICONS = [
  { id: 'zap', icon: <Zap className="w-4 h-4" />, label: '⚡' },
  { id: 'code', icon: <Code className="w-4 h-4" />, label: '💻' },
  { id: 'book', icon: <Book className="w-4 h-4" />, label: '📖' },
  { id: 'terminal', icon: <Terminal className="w-4 h-4" />, label: '⌨️' },
  { id: 'globe', icon: <Globe className="w-4 h-4" />, label: '🌐' },
  { id: 'cpu', icon: <Cpu className="w-4 h-4" />, label: '🤖' },
  { id: 'ghost', icon: <Ghost className="w-4 h-4" />, label: '👻' },
];

export default function Dashboard({ token, userEmail, onLogout, onNavigate }) {
  const [contexts, setContexts] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [focusMode, setFocusMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExtensionActive, setIsExtensionActive] = useState(false);
  const [showPopupAlert, setShowPopupAlert] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    sessionNote: '', 
    dailyFocus: '',
    color: COLORS[0],
    icon: '⚡'
  });
  
  const [urlList, setUrlList] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [showToast, setShowToast] = useState(null); // { message, type }
  
  const fileInputRef = useRef(null);

  const API_BASE = 'https://flux-k6pb.onrender.com/api/contexts';

  const api = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchContexts();

    const onConnect = () => {
      setIsConnected(true);
      const uid = localStorage.getItem('ctx_userId');
      if (uid) socket.emit('sync_user_id', { userId: uid });
    };
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Extension Heartbeat
    const pingInterval = setInterval(() => {
      socket.emit('ping_extension');
    }, 3000);

    const onPong = () => {
      console.log('✨ Extension detected!');
      setIsExtensionActive(true);
    };

    socket.on('extension_pong', onPong);

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowForm(true);
      }
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        document.getElementById('context-search')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('extension_pong', onPong);
      clearInterval(pingInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchContexts = async () => {
    try {
      const res = await api.get('/');
      setContexts(res.data);
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      else console.error('Failed to fetch contexts:', err);
    }
  };

  const notify = (message, type = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const addUrl = () => {
    const raw = urlInput.trim();
    if (!raw) return;
    const formatted = raw.startsWith('http') ? raw : `https://${raw}`;
    if (!urlList.includes(formatted)) setUrlList([...urlList, formatted]);
    setUrlInput('');
  };

  const handleAddContext = async (e) => {
    e.preventDefault();
    if (urlList.length === 0) return alert('Add at least one URL!');
    try {
      const res = await api.post('/', { ...formData, urls: urlList });
      setContexts([res.data, ...contexts]);
      setShowForm(false);
      resetForm();
      notify('New context configured!');
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      else console.error('Failed to add context:', err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', sessionNote: '', dailyFocus: '', color: COLORS[0], icon: '⚡' });
    setUrlList([]);
    setUrlInput('');
  };

  const deleteContext = async (id) => {
    if (!window.confirm('Delete this context?')) return;
    try {
      await api.delete(`/${id}`);
      setContexts(contexts.filter(ctx => ctx._id !== id));
      notify('Context deleted', 'error');
    } catch (err) {
      if (err.response?.status === 401) onLogout();
    }
  };

  const updateInlineField = async (id, field, value) => {
    try {
      const res = await api.put(`/${id}`, { [field]: value });
      setContexts(contexts.map(ctx => ctx._id === id ? res.data : ctx));
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const activateContext = async (context) => {
    let popupBlocked = false;
    
    if (isExtensionActive) {
      socket.emit('activate_context', {
        contextId: context._id,
        userId: localStorage.getItem('ctx_userId'),
        name: context.name,
        urls: context.urls,
        color: context.color,
        icon: context.icon,
        focusMode
      });
      notify(`Launching ${context.name} (via Extension)...`);
    } else {
      // FALLBACK: Manual window.open
      notify(`Extension missing. Launching tabs via Popups...`, 'warning');
      
      // Check once if we've EVER shown the alert to avoid spamming
      const HasSeenForever = localStorage.getItem('flux_popup_hint_done');
      let showingThisClick = false;

      // Browsers block multiple popups unless user allows them.
      context.urls.forEach((url, index) => {
        setTimeout(() => {
          const win = window.open(url, '_blank', 'noopener,noreferrer');
          
          // Detection: If window is null/closed, popup was blocked
          if (!win || win.closed || typeof win.closed === 'undefined') {
            if (!HasSeenForever && !showingThisClick) {
              setShowPopupAlert(true);
              showingThisClick = true; // Prevent multiple popups in THIS single click loop
            }
          }
        }, index * 200);
      });

      // Still inform server for count tracking
      socket.emit('activate_context_manual', { contextId: context._id });
    }

    // Update local count
    setContexts(contexts.map(ctx => 
      ctx._id === context._id ? { ...ctx, activationCount: (ctx.activationCount || 0) + 1, lastActivatedAt: new Date() } : ctx
    ));
  };

  const exportData = async () => {
    try {
      const res = await api.get('/export');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contexts-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      notify('Configuration exported');
    } catch (err) {
      notify('Export failed', 'error');
    }
  };

  const importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        await api.post('/import', json);
        fetchContexts();
        notify('Import successful!');
      } catch (err) {
        notify('Invalid file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  const filteredContexts = contexts.filter(ctx => 
    ctx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ctx.urls.some(url => url.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getHostname = (url) => {
    try { return new URL(url).hostname; } catch { return url; }
  };

  const getFavicon = (url) => {
    try {
      const { origin } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`;
    } catch { return null; }
  };

  return (
    <div className="min-h-screen text-gray-100 p-4 md:p-8 font-sans transition-all duration-500">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
      </div>

      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
              <img src={fluxLogo} alt="Flux" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
              Flux Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)] animate-pulse'}`} />
               <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                 {isConnected ? 'System Online' : 'System Offline'}
               </span>
            </div>
            <p className="text-gray-500 text-xs font-medium border-l border-gray-800 pl-3">
              {contexts.length} Workspaces Available
            </p>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ml-2 transition-all duration-500 ${isExtensionActive ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
               <div className={`w-1.5 h-1.5 rounded-full ${isExtensionActive ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,1)]' : 'bg-amber-400 animate-pulse'}`} />
               <span className={`text-[10px] font-bold uppercase tracking-widest ${isExtensionActive ? 'text-indigo-400' : 'text-amber-400'}`}>
                 {isExtensionActive ? 'Sync Active' : 'Popup Mode'}
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              id="context-search"
              type="text" 
              placeholder="Jump to context... ( / )"
              className="bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Learn Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate?.('learn')}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/40 hover:to-indigo-600/40 border border-violet-500/30 hover:border-violet-500/60 text-violet-300 font-bold text-xs rounded-xl transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Learn
          </motion.button>

          <div className="h-8 w-px bg-gray-800 hidden sm:block" />

          {/* Action Hub */}
          <div className="flex items-center gap-2">
            <button 
              onClick={exportData}
              title="Backup Config"
              className="p-2.5 bg-gray-950 border border-gray-800 rounded-xl text-gray-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              title="Restore Config"
              className="p-2.5 bg-gray-950 border border-gray-800 rounded-xl text-gray-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              <input type="file" ref={fileInputRef} onChange={importData} accept=".json" className="hidden" />
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-xs rounded-xl transition-all hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Dashboard Body */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <History className="w-5 h-5 text-indigo-400" />
                 Your Workspaces
               </h2>
               <div className="flex items-center gap-4 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800 group transition-all hover:border-rose-500/30">
                 <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Focus</span>
                   <span className={`text-xs font-bold ${focusMode ? 'text-rose-400' : 'text-gray-400'}`}>
                     {focusMode ? 'Tab Purge Enabled' : 'Standard Launch'}
                   </span>
                 </div>
                 <button 
                   onClick={() => setFocusMode(!focusMode)}
                   className={`relative w-10 h-5 rounded-full transition-colors ${focusMode ? 'bg-rose-500' : 'bg-gray-700'}`}
                 >
                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${focusMode ? 'left-6' : 'left-1'}`} />
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
              <AnimatePresence mode="popLayout">
                {filteredContexts.map((ctx, idx) => (
                  <motion.div 
                    layout
                    key={ctx._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 blur-xl z-0" style={{ backgroundImage: `linear-gradient(to right, ${ctx.color || '#6366f1'}, transparent)` }} />
                    <div className="relative z-10 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300 shadow-2xl">
                      
                      {/* Card Header */}
                      <div className="p-5 flex items-start justify-between">
                         <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner overflow-hidden relative" style={{ backgroundColor: `${ctx.color}15` }}>
                             <div className="absolute inset-0 opacity-20" style={{ backgroundColor: ctx.color }} />
                             <span className="relative z-10">{ctx.icon || '⚡'}</span>
                           </div>
                           <div>
                             <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{ctx.name}</h3>
                             <div className="flex items-center gap-2 mt-0.5">
                               <Timer className="w-3 h-3 text-gray-500" />
                               <span className="text-[10px] font-medium text-gray-500">
                                 {ctx.activationCount || 0} launches • Last: {ctx.lastActivatedAt ? new Date(ctx.lastActivatedAt).toLocaleDateString() : 'Never'}
                               </span>
                             </div>
                           </div>
                         </div>
                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => deleteContext(ctx._id)} className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                               <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                      </div>

                      {/* Card Body */}
                      <div className="px-5 pb-5 space-y-4">
                        
                        {/* Daily Focus - Inline editable */}
                        <div className="space-y-1.5">
                           <div className="flex items-center justify-between">
                             <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Today's Focus</label>
                           </div>
                           <input 
                             className="w-full bg-transparent text-sm text-indigo-400 font-semibold border-none outline-none focus:ring-0 p-0 placeholder-gray-700" 
                             defaultValue={ctx.dailyFocus || 'Click to set target...'}
                             onBlur={(e) => updateInlineField(ctx._id, 'dailyFocus', e.target.value)}
                             placeholder="Set a main goal..."
                           />
                        </div>

                        {/* Session Note - Inline editable */}
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Notes</label>
                           <textarea 
                             className="w-full bg-gray-950/50 border border-gray-800 rounded-lg p-2.5 text-xs text-gray-400 italic resize-none outline-none focus:border-indigo-500/50 transition-colors"
                             defaultValue={ctx.sessionNote}
                             rows={2}
                             onBlur={(e) => updateInlineField(ctx._id, 'sessionNote', e.target.value)}
                             placeholder="Jot down quick reminders for this session..."
                           />
                        </div>

                        {/* URLs */}
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Stack ({ctx.urls.length})</label>
                           <div className="flex flex-wrap gap-1.5">
                             {ctx.urls.slice(0, 4).map((url, i) => (
                               <div key={i} className="flex items-center gap-1.5 bg-gray-950 px-2 py-1.5 rounded-lg border border-gray-800" title={url}>
                                 <img src={getFavicon(url)} alt="" className="w-3.5 h-3.5 rounded-sm" />
                                 <span className="text-[10px] text-gray-400 max-w-[80px] truncate">{getHostname(url)}</span>
                               </div>
                             ))}
                             {ctx.urls.length > 4 && (
                               <div className="px-2 py-1.5 bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 rounded-lg text-[10px] font-bold">
                                 +{ctx.urls.length - 4}
                               </div>
                             )}
                           </div>
                        </div>

                        <button 
                          onClick={() => activateContext(ctx)}
                          className="w-full py-3 rounded-xl bg-gray-800 hover:bg-white hover:text-black border border-gray-700 hover:border-white transition-all duration-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group-active:scale-[0.98]"
                        >
                          <Activity className="w-4 h-4" />
                          Launch Workspace
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Learning Dashboard Feature Card */}
              {searchQuery === '' && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="relative group cursor-pointer overflow-hidden"
                  onClick={() => onNavigate?.('learn')}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-indigo-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-gray-900 border border-violet-500/20 hover:border-violet-500/50 rounded-2xl p-6 flex flex-col items-start gap-4 min-h-[220px] transition-all duration-500 shadow-xl shadow-violet-500/5">
                    <div className="flex items-center justify-between w-full">
                      <div className="p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/30">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">AI Agent</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Flux Research</h3>
                      <p className="text-sm text-gray-500">Type any subject — React, Python, Docker — and the Research Sub-Agent finds the top 3 documentation sites with Quick Start guides.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {['React', 'Python', 'Docker', 'SQL'].map(tag => (
                        <span key={tag} className="text-[10px] text-gray-600 bg-gray-800 px-2 py-1 rounded-md font-bold">{tag}</span>
                      ))}
                    </div>
                    <div className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/20 group-hover:from-violet-600/40 group-hover:to-indigo-600/40 transition-all text-violet-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Open Research Agent
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Add New Mockup / Trigger */}
              {!showForm && searchQuery === '' && (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowForm(true)}
                  className="bg-gray-900 border border-gray-800 border-dashed rounded-2xl flex flex-col items-center justify-center min-h-[200px] group hover:border-indigo-500/50 transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-indigo-500/20">
                     <Plus className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Configure Workspace</span>
                  <span className="text-[10px] text-gray-700 mt-1 uppercase tracking-widest font-black">Ctrl + N</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Right Sidebar - Config Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full md:w-96"
              >
                <div className="sticky top-8 bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                   
                   <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Create Context</h2>
                      <button onClick={() => setShowForm(false)} className="p-2 text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                   </div>

                   <form onSubmit={handleAddContext} className="space-y-5">
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Icon & Theme</label>
                          <div className="flex gap-2 mb-3">
                            {ICONS.map(i => (
                              <button 
                                key={i.id}
                                type="button"
                                onClick={() => setFormData({...formData, icon: i.label})}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${formData.icon === i.label ? 'ring-2 ring-indigo-500 bg-indigo-500/20' : 'bg-gray-950 border border-gray-800 text-gray-500'}`}
                              >
                                {i.label}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            {COLORS.map(c => (
                              <button 
                                key={c}
                                type="button"
                                onClick={() => setFormData({...formData, color: c})}
                                className={`w-6 h-6 rounded-full border-2 ${formData.color === c ? 'border-white ring-2 ring-white/20' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Name</label>
                           <input 
                             type="text" placeholder="e.g. Deep Work, Lab Setup..." required
                             className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none transition-colors"
                             value={formData.name}
                             onChange={e => setFormData({ ...formData, name: e.target.value })}
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Resources (URLs)</label>
                           <div className="flex gap-2">
                             <input 
                               type="text" placeholder="github.com..."
                               className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none transition-colors"
                               value={urlInput}
                               onChange={e => setUrlInput(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
                             />
                             <button type="button" onClick={addUrl} className="px-4 bg-indigo-600 rounded-xl font-bold flex items-center justify-center">
                               <Plus className="w-5 h-5" />
                             </button>
                           </div>
                           <div className="flex flex-wrap gap-2 pt-2">
                             {urlList.map((url, i) => (
                               <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg group/url">
                                 <img src={getFavicon(url)} alt="" className="w-3 h-3" />
                                 <span className="text-[10px] text-gray-400 max-w-[100px] truncate">{getHostname(url)}</span>
                                 <button type="button" onClick={() => setUrlList(urlList.filter((_, idx)=>idx!==i))} className="text-gray-600 hover:text-rose-500">
                                   <X className="w-3 h-3" />
                                 </button>
                               </div>
                             ))}
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Focus Goal</label>
                           <input 
                             type="text" placeholder="What's the outcome today?"
                             className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none transition-colors"
                             value={formData.dailyFocus}
                             onChange={e => setFormData({ ...formData, dailyFocus: e.target.value })}
                           />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-800 rounded-xl font-black text-xs uppercase tracking-widest">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20">Create Suite</button>
                      </div>
                   </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Persistence Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl z-50 border flex items-center gap-3 font-bold text-sm ${showToast.type === 'error' ? 'bg-rose-500/90 border-rose-400 text-white' : 'bg-indigo-500/90 border-indigo-400 text-white'}`}
          >
            {showToast.type === 'error' ? <Trash2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Blocked Guider */}
      <AnimatePresence>
        {showPopupAlert && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-gray-900 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.15)] text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
               
               <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Globe className="w-8 h-8 text-amber-400" />
               </div>

               <h2 className="text-2xl font-black text-white mb-2">Popups Blocked!</h2>
               <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                 To open all your links at once on this computer, please click the <strong>pop-up icon</strong> in your browser's address bar and select <strong>"Always allow pop-ups from Flux."</strong>
               </p>

               <div className="bg-black/40 border border-gray-800 rounded-2xl p-4 mb-8 flex items-center gap-4 text-left">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xl">💡</div>
                  <div className="flex-1 text-xs text-gray-500 font-medium">
                    This is only required once per browser. After you allow it, your workspaces will launch instantly!
                  </div>
               </div>

               <button 
                onClick={() => {
                  setShowPopupAlert(false);
                  localStorage.setItem('flux_popup_hint_done', 'true');
                }}
                className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-amber-400 transition-colors"
               >
                 Got it, I'll allow them
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import fluxLogo from './assets/flux-logo.png';
import {
  Send, Sparkles, BookOpen, Clock, Trash2, ArrowLeft, Search, X, Loader2,
  Activity, Globe, Cpu, Zap, Layout
} from 'lucide-react';
import ResearchTabs from './ResearchTabs';

const socket = io(import.meta.env.MODE === 'production' ? 'https://flux-k6pb.onrender.com' : 'http://localhost:5001', {
  transports: ['websocket'],
  reconnection: true
});

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://flux-k6pb.onrender.com/api' 
  : 'http://localhost:5001/api';

export default function LearnDashboard({ token, userId, onBack }) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null); // { subject, resources }
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      text: "Hello! I'm your Research Agent 🔬 Type any subject — React, Python, Docker, SQL, TypeScript — and I'll find the top 3 documentation and tutorial resources for you instantly."
    }
  ]);
  const [liveFocus, setLiveFocus] = useState(null); // { focus, url, title, timestamp }
  const [lastHeartbeat, setLastHeartbeat] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const api = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchHistory();
    inputRef.current?.focus();

    // Listen for live focus updates from extension heartbeats
    socket.on('context_focus_update', (data) => {
      setLiveFocus(data);
      setLastHeartbeat(Date.now());
    });

    // Request initial context and sync user
    const uid = userId || localStorage.getItem('ctx_userId');
    if (uid) {
      socket.emit('sync_user_id', { userId: uid });
      socket.emit('request_live_context', { userId: uid });
    }

    return () => {
      socket.off('context_focus_update');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, result]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/research');
      setHistory(res.data);
    } catch (err) {
      console.error('History fetch failed:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSearch = async (subject) => {
    const query = (subject || inputValue).trim();
    if (!query || isLoading) return;

    setInputValue('');
    setError(null);
    setResult(null);

    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, type: 'user', text: query }]);

    // Add typing indicator
    const typingId = 'typing-' + Date.now();
    setMessages(prev => [...prev, { id: typingId, type: 'typing' }]);
    setIsLoading(true);

    try {
      const res = await api.get(`/research/${encodeURIComponent(query)}`);
      const data = res.data;

      // Remove typing, add bot response
      setMessages(prev => prev.filter(m => m.id !== typingId).concat([{
        id: 'res-' + Date.now(),
        type: 'bot',
        text: `Found ${data.resources.length} resources for **${data.subject}**! ${data.fromCache ? '*(from cache)*' : ''} Here are your tabs below 👇`,
        hasResult: true
      }]));

      setResult(data);
      fetchHistory(); // Refresh history
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== typingId).concat([{
        id: 'err-' + Date.now(),
        type: 'error',
        text: err.response?.data?.error || 'Research failed. Please try again.'
      }]));
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/research/${id}`);
      setHistory(prev => prev.filter(h => h._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const suggestedTopics = [
    { label: 'React', emoji: '⚛️' },
    { label: 'Python', emoji: '🐍' },
    { label: 'Docker', emoji: '🐳' },
    { label: 'TypeScript', emoji: '🔷' },
    { label: 'MongoDB', emoji: '🍃' },
    { label: 'SQL', emoji: '🗃️' },
    { label: 'GraphQL', emoji: '◈' },
    { label: 'Git', emoji: '🔀' },
  ];

  return (
    <div className="min-h-screen text-gray-100 font-sans flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-violet-500/5 rounded-full blur-[130px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-gray-950/80 border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
                <img src={fluxLogo} alt="Flux" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-white">Flux Research</h1>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Research Sub-Agent Active</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,1)] animate-pulse" />
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Agent Online</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 flex gap-6">

        {/* Left — History Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 gap-6">
          
          {/* Live Context Panel */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="w-12 h-12 text-violet-400" />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] ${
                  (lastHeartbeat && Date.now() - lastHeartbeat < 45000) 
                    ? 'bg-emerald-500 animate-pulse' 
                    : 'bg-gray-600'
                }`} />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {(lastHeartbeat && Date.now() - lastHeartbeat < 45000) ? 'Sync Active' : 'Extension Idle'}
                </span>
              </div>
              <Activity className={`w-3 h-3 ${
                (lastHeartbeat && Date.now() - lastHeartbeat < 45000) ? 'text-emerald-500/50' : 'text-gray-700'
              }`} />
            </div>

            <AnimatePresence mode="wait">
              {liveFocus ? (
                <motion.div
                  key={liveFocus.url}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div>
                    <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Cpu className="w-3 h-3" />
                      Inferred Focus
                    </p>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {liveFocus.focus}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-gray-800/50">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />
                      Active Tab
                    </p>
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <img 
                          src={`https://www.google.com/s2/favicons?domain=${new URL(liveFocus.url).origin}&sz=32`} 
                          className="w-3.5 h-3.5"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <Layout className="w-3 h-3 text-gray-600 absolute" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-gray-300 truncate w-full" title={liveFocus.title}>
                          {liveFocus.title || 'Untitled Page'}
                        </p>
                        <p className="text-[9px] text-gray-600 truncate font-mono mt-0.5">
                          {new URL(liveFocus.url).hostname}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-4 text-center"
                >
                  <div className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium">Waiting for extension heartbeat...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Searches</span>
            </div>
            <div className="space-y-1.5">
              {historyLoading ? (
                <div className="flex items-center gap-2 text-xs text-gray-600 py-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading...
                </div>
              ) : history.length === 0 ? (
                <p className="text-xs text-gray-700 py-2">No searches yet</p>
              ) : (
                history.map(h => (
                  <motion.div
                    key={h._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group flex items-center justify-between px-3 py-2 bg-gray-900/50 hover:bg-gray-900 border border-transparent hover:border-gray-800 rounded-xl cursor-pointer transition-all"
                    onClick={() => handleSearch(h.subject)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Search className="w-3 h-3 text-gray-600 flex-shrink-0" />
                      <span className="text-xs text-gray-400 capitalize truncate">{h.subject}</span>
                    </div>
                    <button
                      onClick={(e) => deleteHistoryItem(h._id, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-rose-400 transition-all p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Right — Main Content */}
        <div className="flex-1 min-w-0">

          {/* Chat Messages */}
          <div className="space-y-4 mb-6">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.type === 'typing' ? (
                    <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-violet-500"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  ) : msg.type === 'user' ? (
                    <div className="max-w-md px-4 py-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl rounded-tr-sm text-white text-sm font-medium shadow-lg shadow-violet-500/20">
                      {msg.text}
                    </div>
                  ) : msg.type === 'error' ? (
                    <div className="max-w-md px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl rounded-tl-sm text-rose-400 text-sm">
                      ⚠️ {msg.text}
                    </div>
                  ) : (
                    <div className="max-w-xl flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm text-sm text-gray-300">
                        {msg.text.split('**').map((part, i) =>
                          i % 2 === 1
                            ? <strong key={i} className="text-white">{part}</strong>
                            : <span key={i}>{part}</span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Research Tabs Result */}
          <AnimatePresence>
            {result && result.resources && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <ResearchTabs resources={result.resources} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggested Topics */}
          {messages.length <= 2 && !result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-3">Popular topics</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map(topic => (
                  <button
                    key={topic.label}
                    onClick={() => handleSearch(topic.label)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 hover:border-violet-500/50 hover:bg-gray-800 rounded-xl text-sm text-gray-400 hover:text-white transition-all"
                  >
                    <span>{topic.emoji}</span>
                    <span className="font-medium">{topic.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat Input */}
          <div className="sticky bottom-6 mt-8">
            <div className="relative bg-gray-900 border border-gray-700 focus-within:border-violet-500/60 rounded-2xl shadow-2xl shadow-black/40 transition-all">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a subject to research... (e.g. React, Python, Docker)"
                className="w-full bg-transparent px-5 py-4 pr-14 text-sm text-white placeholder-gray-600 outline-none rounded-2xl"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSearch()}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />
                }
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-700 mt-2">Press Enter to search • Research Sub-Agent will find the top 3 resources</p>
          </div>
        </div>
      </div>
    </div>
  );
}

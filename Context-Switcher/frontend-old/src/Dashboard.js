import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Updated to Port 5001 to match your backend
const socket = io('http://localhost:5001');

export default function Dashboard() {
  const [contexts, setContexts] = useState([]);
  const [focusMode, setFocusMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', urls: '', sessionNote: '', dailyFocus: '' });
  const [showToast, setShowToast] = useState(false);

  // Base URL for API calls
  const API_BASE = 'http://localhost:5001/api/contexts';

  useEffect(() => {
    fetchContexts();
  }, []);

  const fetchContexts = async () => {
    try {
      const res = await axios.get(API_BASE);
      setContexts(res.data);
    } catch (err) {
      console.error('Failed to fetch contexts:', err);
    }
  };

  const handleAddContext = async (e) => {
    e.preventDefault();
    try {
      // Clean up URLs: ensure they have http/https and remove whitespace
      const urlsArray = formData.urls.split(',')
        .map(url => url.trim())
        .filter(url => url)
        .map(url => (url.startsWith('http') ? url : `https://${url}`));

      const payload = { ...formData, urls: urlsArray };
      const res = await axios.post(API_BASE, payload);

      setContexts([...contexts, res.data]);
      setShowForm(false);
      setFormData({ name: '', urls: '', sessionNote: '', dailyFocus: '' });
      
      // UI Polish: Show Success Toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to add context:', err);
    }
  };

  const deleteContext = async (id) => {
    if (!window.confirm('Delete this context?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setContexts(contexts.filter(ctx => ctx._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const activateContext = (context) => {
    socket.emit('activate_context', {
      name: context.name,
      urls: context.urls,
      focusMode: focusMode
    });
  };

  // Helper to safely get hostname for the UI badges
  const getHostname = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
            Context Command Center
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Port 5001 Active • Connected to MongoDB Atlas</p>
        </div>

        <div className="flex items-center space-x-3 bg-gray-900 px-4 py-3 rounded-xl border border-gray-800 shadow-inner">
          <span className="text-sm font-semibold text-gray-300">Focus Mode (Purge Tabs)</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={focusMode}
              onChange={() => setFocusMode(!focusMode)}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500 shadow-md"></div>
          </label>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {contexts.map(ctx => (
          <div key={ctx._id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 group flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                {ctx.name}
              </h2>
              <button
                onClick={() => deleteContext(ctx._id)}
                className="text-gray-600 hover:text-rose-500 transition-colors"
                title="Delete Context"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>

            <div className="mb-6 flex-grow space-y-4">
              <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-800">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Daily Focus
                </h3>
                <p className="text-sm text-cyan-300 font-medium">
                  {ctx.dailyFocus || 'No specific focus set.'}
                </p>
              </div>

              <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-800">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Session Note</h3>
                <p className="text-sm text-gray-400 italic">
                  {ctx.sessionNote || 'No notes yet.'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Workspace URLs ({ctx.urls.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {ctx.urls.map((url, idx) => (
                    <span key={idx} className="bg-indigo-900/30 text-indigo-300 text-xs px-2.5 py-1 rounded-md border border-indigo-800/50 truncate max-w-[150px]" title={url}>
                      {getHostname(url)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => activateContext(ctx)}
              className="w-full mt-auto bg-gray-800 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-cyan-600 border border-gray-700 hover:border-transparent text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 active:scale-95 flex justify-center items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Activate
            </button>
          </div>
        ))}

        {!showForm ? (
          <div onClick={() => setShowForm(true)} className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-800 hover:border-gray-600 transition-all min-h-[350px] group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:bg-gray-700">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <span className="text-gray-400 font-semibold tracking-wide">Configure New Context</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddContext} className="bg-gray-900 rounded-2xl p-6 border border-indigo-500/50 transition-all duration-300 shadow-xl flex flex-col relative overflow-hidden">
            <h2 className="text-xl font-bold mb-4 text-white">New Context</h2>
            <div className="space-y-4 flex-grow">
              <input type="text" placeholder="Context Name (e.g. MERN Lab)" required className="w-full bg-gray-950/50 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <input type="text" placeholder="URLs (google.com, github.com)" className="w-full bg-gray-950/50 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500" value={formData.urls} onChange={e => setFormData({ ...formData, urls: e.target.value })} />
              <input type="text" placeholder="Daily Focus" className="w-full bg-gray-950/50 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500" value={formData.dailyFocus} onChange={e => setFormData({ ...formData, dailyFocus: e.target.value })} />
              <textarea placeholder="Session Note" className="w-full bg-gray-950/50 border border-gray-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500 resize-none" rows="2" value={formData.sessionNote} onChange={e => setFormData({ ...formData, sessionNote: e.target.value })}></textarea>
            </div>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="w-1/2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl transition-all">Cancel</button>
              <button type="submit" className="w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl transition-all">Save Context</button>
            </div>
          </form>
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-emerald-500/90 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold border border-emerald-400/50 transition-all z-50 animate-bounce">
          <span>✅</span> Context saved to Atlas!
        </div>
      )}
    </div>
  );
}
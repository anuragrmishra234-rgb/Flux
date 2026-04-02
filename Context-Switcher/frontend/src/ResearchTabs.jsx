import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useState } from 'react';

const tabVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } }
};

function QuickStart({ items }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-gray-800 overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
          >
            <span className="text-sm font-semibold text-indigo-300">{item.heading}</span>
            {openIdx === i
              ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />}
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 bg-gray-950 text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                  {item.body}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function IframeTab({ url, title }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-6">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-300 mb-1">This site blocks embedding</p>
          <p className="text-xs text-gray-500">Open it directly in a new tab to read the docs.</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open {title}
        </a>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[480px] rounded-xl overflow-hidden border border-gray-800">
      <iframe
        src={url}
        title={title}
        className="w-full h-full bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onError={() => setFailed(true)}
        // If the iframe loads but X-Frame-Options blocks it, it shows blank
        onLoad={(e) => {
          try {
            // If we can't access contentDocument, it was blocked
            const doc = e.target.contentDocument;
            if (!doc || doc.body.innerHTML === '') setFailed(true);
          } catch {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}

// Sites known to block iframes
const IFRAME_BLOCKED = [
  'developer.mozilla.org',
  'react.dev',
  'docs.python.org',
  'nodejs.org',
  'www.typescriptlang.org',
  'mongoosejs.com',
  'www.mongodb.com',
  'nextjs.org',
  'graphql.org',
  'www.apollographql.com',
  'expressjs.com',
  'docs.docker.com',
  'git-scm.com',
  'www.postgresql.org',
  'cp-algorithms.com',
  'basarat.gitbook.io',
  'vuejs.org',
  'nuxt.com',
];

function isLikelyBlocked(url) {
  try {
    const { hostname } = new URL(url);
    return IFRAME_BLOCKED.some(blocked => hostname.includes(blocked));
  } catch { return false; }
}

export default function ResearchTabs({ resources }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!resources || resources.length === 0) return null;

  const activeResource = resources[activeTab];

  return (
    <div className="mt-6">
      {/* Tab Bar */}
      <div className="flex gap-2 mb-0 overflow-x-auto pb-px">
        {resources.map((res, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl whitespace-nowrap transition-colors focus:outline-none ${
              activeTab === i
                ? 'bg-gray-900 text-white border border-b-0 border-gray-700'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'
            }`}
          >
            <span className="text-base">{res.emoji || '📄'}</span>
            <span className="max-w-[140px] truncate">{res.title.split('—')[0].trim()}</span>
            {activeTab === i && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-[-1px] left-0 right-0 h-px bg-indigo-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <div className="bg-gray-900 border border-gray-700 rounded-b-2xl rounded-tr-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-5 space-y-5"
          >
            {/* Tab Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">{activeResource.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{activeResource.description}</p>
              </div>
              <a
                href={activeResource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-indigo-600 border border-gray-700 hover:border-indigo-500 text-gray-400 hover:text-white text-xs font-bold rounded-lg transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open
              </a>
            </div>

            {/* Contextual Summary Banner */}
            {activeResource.contextual_summary && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-violet-600/10 border border-violet-500/20 rounded-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-violet-500/20 rounded-md">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                  </div>
                  <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Why this is relevant to you</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed italic border-l-2 border-violet-500/50 pl-3">
                  "{activeResource.contextual_summary}"
                </p>
              </motion.div>
            )}

            {/* Divider */}
            <div className="h-px bg-gray-800" />

            {/* Content — iframe or quick start */}
            {isLikelyBlocked(activeResource.url) ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Quick Start Guide</span>
                </div>
                <QuickStart items={activeResource.quickStart || []} />
                <a
                  href={activeResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-indigo-600 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white text-sm font-bold rounded-xl transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Full Docs in New Tab
                </a>
              </div>
            ) : (
              <div>
                <IframeTab url={activeResource.url} title={activeResource.title} />
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Quick Start Guide</span>
                  </div>
                  <QuickStart items={activeResource.quickStart || []} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

require('dotenv').config();

const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Context = require('./models/ContextModel');
const User = require('./models/UserModel');
const ResearchResult = require('./models/ResearchModel');
const Heartbeat = require('./models/HeartbeatModel');
const { searchSubject, normalizeSubject } = require('./agents/researchAgent');

const app = express();
const server = http.createServer(app);

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.get('/', (req, res) => res.send('Flux API is running successfully! 🚀'));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

/**
 * MONGODB CONNECTION
 */
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.log('🔄 Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

/**
 * AUTH MIDDLEWARE
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Please log in.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

/**
 * INFER FOCUS
 * Maps URL domains and page title keywords → human-readable focus string.
 */
function inferFocus(url, title) {
  const safeUrl = (url || '').toLowerCase();
  const safeTitle = (title || '').toLowerCase();

  const matchers = [
    { pattern: /jwt\.io/,                           label: 'Debugging JWT Tokens' },
    { pattern: /expressjs\.com/,                    label: 'Reading Express.js Docs' },
    { pattern: /react\.dev|reactjs\.org/,           label: 'Reading React Docs' },
    { pattern: /nodejs\.org/,                       label: 'Reading Node.js Docs' },
    { pattern: /mongoosejs\.com/,                   label: 'Reading Mongoose Docs' },
    { pattern: /mongodb\.com/,                      label: 'Browsing MongoDB Docs' },
    { pattern: /developer\.mozilla\.org/,           label: 'Checking MDN Reference' },
    { pattern: /docs\.docker\.com/,                 label: 'Reading Docker Docs' },
    { pattern: /github\.com/,                       label: 'Reviewing Code on GitHub' },
    { pattern: /stackoverflow\.com/,                label: 'Debugging on Stack Overflow' },
    { pattern: /w3schools\.com/,                    label: 'Browsing W3Schools' },
    { pattern: /typescriptlang\.org/,               label: 'Reading TypeScript Docs' },
    { pattern: /nextjs\.org/,                       label: 'Reading Next.js Docs' },
    { pattern: /tailwindcss\.com/,                  label: 'Checking Tailwind Docs' },
    { pattern: /npmjs\.com/,                        label: 'Looking up npm Packages' },
    { pattern: /localhost/,                         label: 'Testing Local App' },
    { pattern: /youtube\.com.*tutorial|tutorial.*youtube\.com/, label: 'Watching a Tutorial' },
    { pattern: /leetcode\.com/,                     label: 'Solving LeetCode Problems' },
    { pattern: /freecodecamp\.org/,                 label: 'Learning on freeCodeCamp' },
    { pattern: /medium\.com|dev\.to|hashnode\.com/, label: 'Reading a Tech Article' },
  ];

  for (const { pattern, label } of matchers) {
    if (pattern.test(safeUrl) || pattern.test(safeTitle)) return label;
  }

  // Title-keyword fallback
  if (safeTitle.includes('auth'))       return 'Working on Authentication';
  if (safeTitle.includes('deploy'))     return 'Exploring Deployment';
  if (safeTitle.includes('api'))        return 'Designing an API';
  if (safeTitle.includes('debug'))      return 'Debugging Code';
  if (safeTitle.includes('test'))       return 'Writing Tests';
  if (safeTitle.includes('css') || safeTitle.includes('style')) return 'Styling the UI';

  return 'Active Development Session';
}

/**
 * CONTEXT ENRICHMENT MIDDLEWARE
 * Fetches the user's last activated workspace + last 5 heartbeats from MongoDB.
 * Attaches them to req.liveContext for the research route handler.
 * Only applied to /api/research/:subject — no global side effects.
 */
const contextEnrichMiddleware = async (req, res, next) => {
  try {
    const [lastCtx, recentHeartbeats] = await Promise.all([
      Context.findOne({ userId: req.userId }).sort({ lastActivatedAt: -1 }).select('name dailyFocus sessionNote urls color'),
      Heartbeat.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(5).select('current_tab_url page_title timestamp')
    ]);

    req.liveContext = {
      activeWorkspace: lastCtx || null,
      recentTabs: recentHeartbeats || []
    };
  } catch (e) {
    // Non-critical — research still works without live context
    req.liveContext = { activeWorkspace: null, recentTabs: [] };
  }
  next();
};

/**
 * AUTH ROUTES
 */
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    console.log(`✅ New user registered: ${email}`);
    res.status(201).json({ token, email: user.email, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'No account found with this email.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password.' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    console.log(`✅ User logged in: ${email}`);
    res.json({ token, email: user.email, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * CONTEXT ROUTES (protected)
 */
// GET all contexts for user
app.get('/api/contexts', authMiddleware, async (req, res) => {
  try {
    const contexts = await Context.find({ userId: req.userId }).sort({ order: 1, createdAt: -1 });
    res.json(contexts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new context
app.post('/api/contexts', authMiddleware, async (req, res) => {
  try {
    const count = await Context.countDocuments({ userId: req.userId });
    const context = new Context({ ...req.body, userId: req.userId, order: count });
    await context.save();
    res.status(201).json(context);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update context (inline edit + color/icon)
app.put('/api/contexts/:id', authMiddleware, async (req, res) => {
  try {
    const context = await Context.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!context) return res.status(404).json({ error: 'Context not found or not yours.' });
    res.json(context);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE context
app.delete('/api/contexts/:id', authMiddleware, async (req, res) => {
  try {
    const context = await Context.findOne({ _id: req.params.id, userId: req.userId });
    if (!context) return res.status(404).json({ error: 'Context not found or not yours.' });
    await Context.findByIdAndDelete(req.params.id);
    res.json({ message: 'Context deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET export all contexts as JSON
app.get('/api/contexts/export', authMiddleware, async (req, res) => {
  try {
    const contexts = await Context.find({ userId: req.userId }).lean();
    const exportData = contexts.map(({ _id, userId, __v, ...rest }) => rest);
    res.setHeader('Content-Disposition', 'attachment; filename="contexts-backup.json"');
    res.setHeader('Content-Type', 'application/json');
    res.json(exportData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST import contexts from JSON
app.post('/api/contexts/import', authMiddleware, async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected an array of contexts.' });

    const count = await Context.countDocuments({ userId: req.userId });
    const docs = items.map((item, i) => ({
      ...item,
      userId: req.userId,
      order: count + i,
      activationCount: 0,
      lastActivatedAt: null
    }));

    await Context.insertMany(docs);
    res.json({ message: `Imported ${docs.length} context(s).` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * RESEARCH ROUTES (protected)
 */
// GET research results for a subject (with caching + context enrichment)
app.get('/api/research/:subject', authMiddleware, contextEnrichMiddleware, async (req, res) => {
  const subject = req.params.subject?.trim();
  if (!subject) return res.status(400).json({ error: 'Subject is required.' });

  try {
    const normalized = normalizeSubject(subject);

    // Check cache first (per user, per subject)
    const cached = await ResearchResult.findOne({
      userId: req.userId,
      normalizedSubject: normalized
    }).sort({ createdAt: -1 });

    if (cached) {
      return res.json({
        subject: cached.subject,
        normalizedSubject: cached.normalizedSubject,
        resources: cached.resources,
        fromCache: true
      });
    }

    // Run research sub-agent with live context
    const result = await searchSubject(subject, req.liveContext);

    // Save to MongoDB
    const doc = new ResearchResult({
      userId: req.userId,
      subject: result.subject,
      normalizedSubject: result.normalizedSubject,
      resources: result.resources
    });
    await doc.save();

    res.json(result);
  } catch (err) {
    console.error('Research error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET research history for user (last 20)
app.get('/api/research', authMiddleware, async (req, res) => {
  try {
    const history = await ResearchResult.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('subject normalizedSubject createdAt');
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE research history entry
app.delete('/api/research/:id', authMiddleware, async (req, res) => {
  try {
    await ResearchResult.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * SOCKET.IO
 */
const clients = new Map();

io.on('connection', (socket) => {
  console.log(`📡 New Connection: ${socket.id}`);

  socket.on('extension_log', (log) => {
    if (log.startsWith('EXT_')) {
      clients.set(socket.id, 'EXTENSION');
      console.log(`🧩 EXTENSION LOG [${socket.id.substring(0, 5)}]: ${log}`);
    } else {
      console.log(`📋 LOG [${socket.id.substring(0, 5)}]: ${log}`);
    }
  });

  socket.on('sync_user_id', (data) => {
    const { userId } = data || {};
    if (!userId) return;
    console.log(`🔄 SYNC: User shared across clients for ID ${userId}`);
    io.emit('trigger_extension_sync', { userId });
  });

  socket.on('activate_context', async (data) => {
    console.log(`\n🚀 ACTIVATE: "${data.name}"`);
    console.log(`🔗 URLs: ${data.urls.join(', ')}`);
    console.log(`🔥 Focus Mode: ${data.focusMode ? 'ENABLED' : 'DISABLED'}`);

    // Update activation stats
    if (data.contextId) {
      try {
        await Context.findByIdAndUpdate(data.contextId, {
          $inc: { activationCount: 1 },
          lastActivatedAt: new Date()
        });
      } catch (e) { /* non-critical */ }
    }

    // Check if an extension is connected
    const isExtensionConnected = [...clients.values()].includes('EXTENSION');
    
    if (!isExtensionConnected) {
      console.log('⏳ No extension found. Buffering command for 1.5s (waiting for SW wake)...');
      setTimeout(() => {
        io.emit('trigger_extension_context', data);
        console.log('📡 Delayed Broadcast sent.');
      }, 1500);
    } else {
      io.emit('trigger_extension_context', data);
      console.log('📡 Broadcast sent.\n');
    }
  });

  /**
   * HEARTBEAT — Extension reports active tab every 30s
   */
  socket.on('heartbeat', async (data) => {
    const { userId, current_tab_url, page_title } = data || {};
    if (!userId) return;
    try {
      await Heartbeat.create({ userId, socketId: socket.id, current_tab_url, page_title });
      const focus = inferFocus(current_tab_url, page_title);
      // Broadcast focus update to all clients (Dashboard and Extension)
      io.emit('context_focus_update', {
        focus,
        url: current_tab_url,
        title: page_title,
        timestamp: new Date().toISOString()
      });
      console.log(`💓 Heartbeat [${socket.id.substring(0, 5)}]: ${focus} — ${page_title || current_tab_url}`);
    } catch (e) { /* non-critical */ }
  });

  /**
   * LIVE CONTEXT POLL — Dashboard can explicitly request current focus
   */
  socket.on('request_live_context', async (data) => {
    const { userId } = data || {};
    if (!userId) return;
    try {
      const latest = await Heartbeat.findOne({ userId }).sort({ timestamp: -1 }).select('current_tab_url page_title');
      if (latest) {
        socket.emit('context_focus_update', {
          focus: inferFocus(latest.current_tab_url, latest.page_title),
          url: latest.current_tab_url,
          title: latest.page_title,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) { /* non-critical */ }
  });


  /**
   * EXTENSION HEARTBEAT RELAY
   */
  socket.on('ping_extension', () => {
    // Send ping to all clients (the extension will answer)
    io.emit('trigger_extension_ping');
  });

  socket.on('extension_pong', () => {
    // Relay pong back to all clients (the dashboard will receive it)
    io.emit('extension_pong');
  });


  socket.on('disconnect', () => {
    const type = clients.get(socket.id) || 'DASHBOARD/UNKNOWN';
    console.log(`🔌 ${type} Disconnected: ${socket.id}`);
    clients.delete(socket.id);
  });
});

/**
 * START SERVER
 */
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
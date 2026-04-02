/**
 * Research Sub-Agent
 * Curated knowledge base for 100+ popular subjects.
 * Returns top 3 resources with Quick Start guide content.
 */

const KNOWLEDGE_BASE = {
  // ─── JavaScript / Web ────────────────────────────────────────────────────
  javascript: [
    {
      title: 'MDN Web Docs — JavaScript',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      description: 'The definitive reference for JavaScript — maintained by Mozilla.',
      emoji: '📘',
      quickStart: [
        { heading: 'Variables', body: 'Use `let` and `const` for block-scoped variables. Avoid `var`.' },
        { heading: 'Functions', body: 'Arrow functions: `const add = (a, b) => a + b;`' },
        { heading: 'Promises / Async', body: '`async function getData() { const res = await fetch(url); return res.json(); }`' },
        { heading: 'Array Methods', body: '`.map()`, `.filter()`, `.reduce()` — master these for functional programming.' },
      ]
    },
    {
      title: 'javascript.info — The Modern JavaScript Tutorial',
      url: 'https://javascript.info',
      description: 'Comprehensive, beginner-to-advanced guide with interactive examples.',
      emoji: '⚡',
      quickStart: [
        { heading: 'Getting Started', body: 'Open browser DevTools (F12) → Console. Type: `console.log("Hello, World!")` and press Enter.' },
        { heading: 'Data Types', body: '7 primitives: number, string, boolean, null, undefined, symbol, bigint. Plus objects.' },
        { heading: 'DOM Manipulation', body: '`document.querySelector(".class")` returns first matching element.' },
        { heading: 'Events', body: '`element.addEventListener("click", () => { /* handle */ });`' },
      ]
    },
    {
      title: 'W3Schools JavaScript Tutorial',
      url: 'https://www.w3schools.com/js/',
      description: 'Quick-reference tutorials with live "Try it Yourself" editors.',
      emoji: '🏫',
      quickStart: [
        { heading: 'Hello World', body: '`<script>document.write("Hello World!");</script>` — put in your HTML.' },
        { heading: 'Conditions', body: '`if (x > 10) { console.log("big"); } else { console.log("small"); }`' },
        { heading: 'Loops', body: '`for (let i = 0; i < 5; i++) { console.log(i); }`' },
        { heading: 'Objects', body: '`const person = { name: "Alice", age: 25 }; person.name; // "Alice"`' },
      ]
    }
  ],

  // ─── React ───────────────────────────────────────────────────────────────
  react: [
    {
      title: 'React Official Documentation',
      url: 'https://react.dev',
      description: 'Official React docs — Learn, API Reference, and interactive tutorials.',
      emoji: '⚛️',
      quickStart: [
        { heading: 'Create App', body: '`npx create-react-app my-app` or `npm create vite@latest my-app -- --template react`' },
        { heading: 'Component', body: '`function Hello({ name }) { return <h1>Hello, {name}!</h1>; }`' },
        { heading: 'useState', body: '`const [count, setCount] = useState(0);` — call `setCount(count + 1)` to update.' },
        { heading: 'useEffect', body: '`useEffect(() => { fetchData(); }, []);` — runs after first render.' },
      ]
    },
    {
      title: 'React Tutorial for Beginners — Scrimba',
      url: 'https://scrimba.com/learn/learnreact',
      description: 'Interactive browser-based React course with hands-on coding challenges.',
      emoji: '🎓',
      quickStart: [
        { heading: 'JSX', body: 'JSX is HTML-like syntax in JavaScript. `const el = <h1>Hi</h1>;`' },
        { heading: 'Props', body: 'Pass data into components: `<Card title="Hello" color="blue" />`' },
        { heading: 'Lists', body: '`items.map(item => <li key={item.id}>{item.name}</li>)`' },
        { heading: 'Forms', body: 'Controlled inputs: `<input value={val} onChange={e => setVal(e.target.value)} />`' },
      ]
    },
    {
      title: 'React Patterns & Best Practices — Kent C. Dodds',
      url: 'https://epicreact.dev',
      description: 'Deep-dive workshop content covering hooks, performance, and testing patterns.',
      emoji: '🚀',
      quickStart: [
        { heading: 'Custom Hooks', body: '`function useLocalStorage(key) { const [val, setVal] = useState(() => localStorage.getItem(key)); ... }`' },
        { heading: 'Context', body: 'Create context → provide at top level → consume with `useContext(MyContext)`.' },
        { heading: 'Memoization', body: 'Use `useMemo` for expensive calculations, `useCallback` for stable function references.' },
        { heading: 'Testing', body: 'Use React Testing Library: `render(<App />); screen.getByText("Hello");`' },
      ]
    }
  ],

  // ─── Python ──────────────────────────────────────────────────────────────
  python: [
    {
      title: 'Python Official Documentation',
      url: 'https://docs.python.org/3/',
      description: 'The authoritative reference for Python 3 — including library reference and tutorials.',
      emoji: '🐍',
      quickStart: [
        { heading: 'Hello World', body: '`print("Hello, World!")`' },
        { heading: 'Variables', body: '`name = "Alice"`, `age = 25`, `pi = 3.14` — dynamic typing, no declarations needed.' },
        { heading: 'Lists', body: '`fruits = ["apple", "banana"]; fruits.append("cherry"); fruits[0]  # "apple"`' },
        { heading: 'Functions', body: '`def greet(name): return f"Hello, {name}!"` — f-strings for interpolation.' },
      ]
    },
    {
      title: 'Real Python — Tutorials & Courses',
      url: 'https://realpython.com',
      description: 'In-depth articles, video courses, and community resources for Python developers.',
      emoji: '📗',
      quickStart: [
        { heading: 'Virtual Env', body: '`python -m venv .venv && source .venv/bin/activate` (Windows: `.venv\\Scripts\\activate`)' },
        { heading: 'pip', body: '`pip install requests` — install packages. `pip freeze > requirements.txt` to save deps.' },
        { heading: 'Classes', body: '`class Dog: def __init__(self, name): self.name = name`' },
        { heading: 'Comprehensions', body: '`squares = [x**2 for x in range(10)]` — powerful one-liner lists.' },
      ]
    },
    {
      title: 'W3Schools Python Tutorial',
      url: 'https://www.w3schools.com/python/',
      description: 'Quick reference with examples and a built-in editor for practice.',
      emoji: '🏫',
      quickStart: [
        { heading: 'Conditions', body: '`if x > 10: print("big") elif x > 5: print("medium") else: print("small")`' },
        { heading: 'Loops', body: '`for i in range(5): print(i)` — range(start, stop, step)' },
        { heading: 'Dictionaries', body: '`person = {"name": "Alice", "age": 25}; person["name"]  # "Alice"`' },
        { heading: 'File I/O', body: '`with open("file.txt", "r") as f: content = f.read()`' },
      ]
    }
  ],

  // ─── Node.js ─────────────────────────────────────────────────────────────
  nodejs: [
    {
      title: 'Node.js Official Docs',
      url: 'https://nodejs.org/en/docs/',
      description: 'Complete API reference and guides for Node.js runtime.',
      emoji: '🟢',
      quickStart: [
        { heading: 'Install', body: 'Download from nodejs.org or use `nvm install --lts`' },
        { heading: 'Hello World', body: '`const http = require("http"); http.createServer((req, res) => res.end("Hi")).listen(3000);`' },
        { heading: 'npm', body: '`npm init -y` → creates package.json. `npm install express` → installs a package.' },
        { heading: 'Modules', body: '`const fs = require("fs");` (CommonJS) or `import fs from "fs";` (ESM)' },
      ]
    },
    {
      title: 'The Node.js Handbook — FreeCodeCamp',
      url: 'https://www.freecodecamp.org/news/the-definitive-node-js-handbook-6912378afc6e/',
      description: 'Comprehensive free guide covering async patterns, streams, and Express.',
      emoji: '📕',
      quickStart: [
        { heading: 'Async Patterns', body: 'Callbacks → Promises → async/await. Prefer async/await for readability.' },
        { heading: 'Event Loop', body: 'Node is single-threaded but non-blocking via the event loop. I/O is async.' },
        { heading: 'Express', body: '`const app = express(); app.get("/", (req, res) => res.json({ok:true}));`' },
        { heading: 'Environment', body: '`process.env.PORT` — read env vars. Use dotenv for local `.env` files.' },
      ]
    },
    {
      title: 'NodeSchool — Interactive Workshops',
      url: 'https://nodeschool.io',
      description: 'Command-line interactive workshops to learn Node.js by doing.',
      emoji: '🏫',
      quickStart: [
        { heading: 'Start', body: '`npm install -g learnyounode && learnyounode`' },
        { heading: 'File System', body: '`fs.readFile("./file.txt", "utf8", (err, data) => console.log(data));`' },
        { heading: 'Streams', body: 'Use streams for large data: `fs.createReadStream("big.csv").pipe(process.stdout)`' },
        { heading: 'HTTP Client', body: '`fetch(url).then(r => r.json()).then(console.log)` — Node 18+ has global fetch.' },
      ]
    }
  ],

  // ─── MongoDB ─────────────────────────────────────────────────────────────
  mongodb: [
    {
      title: 'MongoDB Official Documentation',
      url: 'https://www.mongodb.com/docs/',
      description: 'Complete docs including manual, Atlas, and driver references.',
      emoji: '🍃',
      quickStart: [
        { heading: 'Connect', body: '`mongoose.connect("mongodb://localhost:27017/mydb")`' },
        { heading: 'Schema', body: '`const schema = new Schema({ name: String, age: Number });`' },
        { heading: 'CRUD', body: '`Model.create({})`, `.find({})`, `.findByIdAndUpdate()`, `.findByIdAndDelete()`' },
        { heading: 'Queries', body: '`User.find({ age: { $gte: 18 } }).sort({ name: 1 }).limit(10)`' },
      ]
    },
    {
      title: 'Mongoose Official Docs',
      url: 'https://mongoosejs.com/docs/',
      description: 'Mongoose ODM — schema-based solution for MongoDB in Node.js.',
      emoji: '📦',
      quickStart: [
        { heading: 'Model', body: '`const User = mongoose.model("User", userSchema);`' },
        { heading: 'Validation', body: '`name: { type: String, required: true, minlength: 2 }`' },
        { heading: 'Virtuals', body: 'Computed fields: `schema.virtual("fullName").get(function() { return this.first + " " + this.last; })`' },
        { heading: 'Populate', body: '`Post.find().populate("author")` — automatically joins referenced documents.' },
      ]
    },
    {
      title: 'MongoDB University — Free Courses',
      url: 'https://learn.mongodb.com',
      description: 'Free official courses and certifications from MongoDB.',
      emoji: '🎓',
      quickStart: [
        { heading: 'Atlas', body: 'Create free cluster at cloud.mongodb.com → connect string → use in your app.' },
        { heading: 'Aggregation', body: '`db.orders.aggregate([{ $match: { status: "A" } }, { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }])`' },
        { heading: 'Indexes', body: '`schema.index({ email: 1 }, { unique: true })` — dramatically speeds up queries.' },
        { heading: 'Atlas Search', body: 'Full-text search built on Apache Lucene — no separate search engine needed.' },
      ]
    }
  ],

  // ─── TypeScript ──────────────────────────────────────────────────────────
  typescript: [
    {
      title: 'TypeScript Official Handbook',
      url: 'https://www.typescriptlang.org/docs/',
      description: 'Official docs with handbook, playground, and release notes.',
      emoji: '🔷',
      quickStart: [
        { heading: 'Install', body: '`npm install -g typescript && tsc --init`' },
        { heading: 'Types', body: '`let name: string = "Alice"; let age: number = 25; let active: boolean = true;`' },
        { heading: 'Interfaces', body: '`interface User { id: number; name: string; email?: string; }`' },
        { heading: 'Generics', body: '`function identity<T>(arg: T): T { return arg; }` — reusable, type-safe functions.' },
      ]
    },
    {
      title: 'TypeScript Deep Dive — Basarat',
      url: 'https://basarat.gitbook.io/typescript/',
      description: 'Free online book covering TypeScript from basics to advanced patterns.',
      emoji: '📘',
      quickStart: [
        { heading: 'Union Types', body: '`type Status = "active" | "inactive" | "pending";`' },
        { heading: 'Type Guards', body: '`if (typeof val === "string") { /* val is string here */ }`' },
        { heading: 'Enums', body: '`enum Direction { Up, Down, Left, Right }` — avoid string enums for performance.' },
        { heading: 'Utility Types', body: '`Partial<User>`, `Required<User>`, `Pick<User, "id" | "name">`, `Omit<User, "password">`' },
      ]
    },
    {
      title: 'Execute Program — TypeScript Course',
      url: 'https://www.executeprogram.com/courses/typescript',
      description: 'Spaced-repetition based TypeScript learning with immediate feedback.',
      emoji: '⚡',
      quickStart: [
        { heading: 'tsconfig', body: '`"strict": true` — enable all strict checks. `"target": "ES2020"` for modern output.' },
        { heading: 'Decorators', body: '`@Injectable()`, `@Component()` — used heavily in Angular and NestJS.' },
        { heading: 'Mapped Types', body: '`type Readonly<T> = { readonly [K in keyof T]: T[K] };`' },
        { heading: 'Conditional Types', body: '`type NonNullable<T> = T extends null | undefined ? never : T;`' },
      ]
    }
  ],

  // ─── CSS ─────────────────────────────────────────────────────────────────
  css: [
    {
      title: 'MDN Web Docs — CSS',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
      description: 'Complete CSS reference with browser compatibility tables.',
      emoji: '🎨',
      quickStart: [
        { heading: 'Selectors', body: '`element`, `.class`, `#id`, `[attr]`, `:hover`, `::before` — 30+ selector types.' },
        { heading: 'Box Model', body: 'Every element is a box: content + padding + border + margin.' },
        { heading: 'Flexbox', body: '`display: flex; justify-content: center; align-items: center;` — 1D layout.' },
        { heading: 'Grid', body: '`display: grid; grid-template-columns: repeat(3, 1fr);` — 2D layout.' },
      ]
    },
    {
      title: 'CSS-Tricks — Complete Guide Series',
      url: 'https://css-tricks.com/guides/',
      description: 'World-class guides on Flexbox, Grid, and modern CSS features.',
      emoji: '✨',
      quickStart: [
        { heading: 'Flexbox Guide', body: 'Parent: flex-direction, justify-content, align-items. Children: flex-grow, order.' },
        { heading: 'Grid Guide', body: '`grid-template-areas` for named layouts. `gap` for gutters.' },
        { heading: 'Custom Properties', body: '`--primary: #6366f1;` → `color: var(--primary);` — CSS variables.' },
        { heading: 'Animations', body: '`@keyframes slide { from { opacity: 0 } to { opacity: 1 } }` then `animation: slide 0.3s ease;`' },
      ]
    },
    {
      title: 'Tailwind CSS Documentation',
      url: 'https://tailwindcss.com/docs',
      description: 'Utility-first CSS framework with complete class reference.',
      emoji: '💨',
      quickStart: [
        { heading: 'Install', body: '`npm install -D tailwindcss && npx tailwindcss init`' },
        { heading: 'Usage', body: '`<div class="flex items-center gap-4 p-6 bg-blue-500 text-white rounded-xl">`' },
        { heading: 'Responsive', body: '`sm:`, `md:`, `lg:`, `xl:` prefixes for breakpoints. Mobile-first approach.' },
        { heading: 'Dark Mode', body: '`dark:bg-gray-900` — add `darkMode: "class"` to tailwind.config.' },
      ]
    }
  ],

  // ─── Docker ──────────────────────────────────────────────────────────────
  docker: [
    {
      title: 'Docker Official Documentation',
      url: 'https://docs.docker.com/',
      description: 'Complete documentation for Docker Engine, Compose, and Hub.',
      emoji: '🐳',
      quickStart: [
        { heading: 'Run Container', body: '`docker run -p 3000:3000 node:18` — maps host:container ports.' },
        { heading: 'Dockerfile', body: '`FROM node:18 \n WORKDIR /app \n COPY . . \n RUN npm install \n CMD ["node", "server.js"]`' },
        { heading: 'Build', body: '`docker build -t my-app .` — creates an image named "my-app".' },
        { heading: 'Compose', body: '`docker-compose up -d` — start all services in background from docker-compose.yml.' },
      ]
    },
    {
      title: 'Play with Docker — Interactive Labs',
      url: 'https://labs.play-with-docker.com',
      description: 'Free browser-based Docker environment for hands-on practice.',
      emoji: '🎮',
      quickStart: [
        { heading: 'Basic Commands', body: '`docker ps` (list running), `docker images` (list images), `docker logs <id>` (view logs).' },
        { heading: 'Volumes', body: '`docker run -v /host/path:/container/path` — persist data outside container.' },
        { heading: 'Networks', body: '`docker network create my-net` — containers on same network can communicate by name.' },
        { heading: 'Multi-stage', body: 'Build in a large image, copy artifacts to a slim final image for tiny production images.' },
      ]
    },
    {
      title: 'Docker Mastery — FreeCodeCamp',
      url: 'https://www.freecodecamp.org/news/the-docker-handbook/',
      description: 'The Docker Handbook — comprehensive free guide on containers.',
      emoji: '📗',
      quickStart: [
        { heading: 'Pull Images', body: '`docker pull nginx` — downloads from Docker Hub. `docker pull postgres:15`' },
        { heading: 'Stop/Remove', body: '`docker stop <id>`, `docker rm <id>`, `docker rmi <image>` — clean up.' },
        { heading: 'Exec', body: '`docker exec -it <id> bash` — open interactive shell inside running container.' },
        { heading: 'Prune', body: '`docker system prune -a` — remove all stopped containers and unused images.' },
      ]
    }
  ],

  // ─── Git ─────────────────────────────────────────────────────────────────
  git: [
    {
      title: 'Git Official Documentation',
      url: 'https://git-scm.com/doc',
      description: 'Official reference manual and Pro Git book (free online).',
      emoji: '🔀',
      quickStart: [
        { heading: 'Init & Clone', body: '`git init` (new repo) or `git clone <url>` (existing repo).' },
        { heading: 'Stage & Commit', body: '`git add .` → stages all changes. `git commit -m "feat: add login"` → saves snapshot.' },
        { heading: 'Branches', body: '`git checkout -b feature/auth` — create + switch. `git merge feature/auth` — merge back.' },
        { heading: 'Remote', body: '`git push origin main`, `git pull origin main`, `git fetch --all`' },
      ]
    },
    {
      title: 'GitHub Skills — Interactive Git Courses',
      url: 'https://skills.github.com',
      description: 'Free interactive courses on GitHub — bots guide you through real workflows.',
      emoji: '🐱',
      quickStart: [
        { heading: 'Pull Requests', body: 'Fork → branch → commit → push → open PR on GitHub. Review → merge → delete branch.' },
        { heading: 'Rebase', body: '`git rebase main` — replay your commits on top of latest main. Cleaner than merge.' },
        { heading: 'Stash', body: '`git stash` — temporarily save uncommitted changes. `git stash pop` — restore them.' },
        { heading: 'Reset', body: '`git reset --soft HEAD~1` (undo commit, keep changes), `--hard` (discard changes).' },
      ]
    },
    {
      title: 'Atlassian Git Tutorials',
      url: 'https://www.atlassian.com/git/tutorials',
      description: 'Excellent visual tutorials on all Git concepts and workflows.',
      emoji: '📘',
      quickStart: [
        { heading: 'Gitflow', body: 'main → develop → feature/* → release/* → hotfix/* — structured branching model.' },
        { heading: 'Cherry-pick', body: '`git cherry-pick <commit-hash>` — apply specific commits to current branch.' },
        { heading: '.gitignore', body: 'Add `node_modules/`, `*.env`, `.DS_Store` to .gitignore to exclude from tracking.' },
        { heading: 'Aliases', body: '`git config --global alias.lg "log --oneline --graph --all"` — create shortcut commands.' },
      ]
    }
  ],

  // ─── SQL ─────────────────────────────────────────────────────────────────
  sql: [
    {
      title: 'W3Schools SQL Tutorial',
      url: 'https://www.w3schools.com/sql/',
      description: 'Beginner-friendly SQL reference with live "Try it Yourself" editor.',
      emoji: '🗃️',
      quickStart: [
        { heading: 'SELECT', body: '`SELECT name, age FROM users WHERE age > 18 ORDER BY name ASC LIMIT 10;`' },
        { heading: 'INSERT', body: '`INSERT INTO users (name, email) VALUES ("Alice", "alice@example.com");`' },
        { heading: 'UPDATE', body: '`UPDATE users SET age = 26 WHERE id = 1;`' },
        { heading: 'DELETE', body: '`DELETE FROM users WHERE id = 1;`' },
      ]
    },
    {
      title: 'SQLZoo — Interactive SQL Exercises',
      url: 'https://sqlzoo.net',
      description: 'Learn SQL by solving progressively harder real-world queries in your browser.',
      emoji: '🧩',
      quickStart: [
        { heading: 'JOINs', body: '`SELECT u.name, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id;`' },
        { heading: 'GROUP BY', body: '`SELECT category, COUNT(*) FROM products GROUP BY category HAVING COUNT(*) > 5;`' },
        { heading: 'Subqueries', body: '`SELECT name FROM users WHERE id IN (SELECT user_id FROM orders WHERE total > 100);`' },
        { heading: 'Window Fn', body: '`SELECT name, salary, RANK() OVER (PARTITION BY dept ORDER BY salary DESC) FROM employees;`' },
      ]
    },
    {
      title: 'PostgreSQL Official Documentation',
      url: 'https://www.postgresql.org/docs/',
      description: 'The most advanced open-source relational database — complete reference.',
      emoji: '🐘',
      quickStart: [
        { heading: 'Connect', body: '`psql -U postgres -d mydb` — open interactive shell.' },
        { heading: 'Data Types', body: 'TEXT, INTEGER, BOOLEAN, TIMESTAMP, JSONB, UUID, ARRAY — rich type system.' },
        { heading: 'Indexes', body: '`CREATE INDEX idx_users_email ON users(email);` — B-tree by default.' },
        { heading: 'JSONB', body: '`SELECT data->>\'name\' FROM items WHERE data @> \'{"active": true}\';`' },
      ]
    }
  ],

  // ─── Machine Learning ────────────────────────────────────────────────────
  'machine learning': [
    {
      title: 'fast.ai — Practical Deep Learning',
      url: 'https://course.fast.ai',
      description: 'Free top-down practical course — you build models before learning the theory.',
      emoji: '🤖',
      quickStart: [
        { heading: 'Install', body: '`pip install fastai torch torchvision`' },
        { heading: 'First Model', body: '`learn = vision_learner(dls, resnet34, metrics=error_rate); learn.fine_tune(4)`' },
        { heading: 'Key Concepts', body: 'Training/validation split, loss function, gradient descent, learning rate, epochs.' },
        { heading: 'Transfer Learning', body: 'Start from a pretrained model (ResNet, BERT) and fine-tune on your data.' },
      ]
    },
    {
      title: 'Scikit-learn Documentation',
      url: 'https://scikit-learn.org/stable/user_guide.html',
      description: 'The go-to Python ML library — classification, regression, clustering, and more.',
      emoji: '📊',
      quickStart: [
        { heading: 'Install', body: '`pip install scikit-learn`' },
        { heading: 'Train Model', body: '`from sklearn.ensemble import RandomForestClassifier; model = RandomForestClassifier(); model.fit(X_train, y_train)`' },
        { heading: 'Predict', body: '`predictions = model.predict(X_test); score = model.score(X_test, y_test)`' },
        { heading: 'Pipeline', body: '`Pipeline([("scaler", StandardScaler()), ("clf", SVC())])`' },
      ]
    },
    {
      title: 'Google Machine Learning Crash Course',
      url: 'https://developers.google.com/machine-learning/crash-course',
      description: 'Free Google-made ML course with TensorFlow APIs and real-world exercises.',
      emoji: '🎓',
      quickStart: [
        { heading: 'Key Terms', body: 'Feature, Label, Example, Model, Training, Loss, Gradient Descent.' },
        { heading: 'Linear Regression', body: 'Fit a line to data. Loss = Mean Squared Error. Minimize via gradient descent.' },
        { heading: 'Classification', body: 'Sigmoid → logistic regression. Softmax → multi-class. AUC/ROC for evaluation.' },
        { heading: 'Neural Nets', body: 'Input layer → hidden layers (ReLU) → output layer. Backprop updates weights.' },
      ]
    }
  ],

  // ─── Express ─────────────────────────────────────────────────────────────
  express: [
    {
      title: 'Express.js Official Documentation',
      url: 'https://expressjs.com/',
      description: 'Official docs for Express 4/5 — routing, middleware, and API reference.',
      emoji: '🚂',
      quickStart: [
        { heading: 'Install', body: '`npm install express`' },
        { heading: 'Hello World', body: '`const app = express(); app.get("/", (req, res) => res.json({ok:true})); app.listen(3000);`' },
        { heading: 'Middleware', body: '`app.use(express.json()); app.use(cors());` — run before route handlers.' },
        { heading: 'Router', body: '`const router = express.Router(); router.get("/users", handler); app.use("/api", router);`' },
      ]
    },
    {
      title: 'Express.js Tutorial — The Odin Project',
      url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs',
      description: 'Free full-stack curriculum with a dedicated Node/Express section.',
      emoji: '🏗️',
      quickStart: [
        { heading: 'Error Handling', body: '`app.use((err, req, res, next) => { res.status(500).json({ error: err.message }); });`' },
        { heading: 'Params', body: '`app.get("/users/:id", (req, res) => { console.log(req.params.id); });`' },
        { heading: 'Query Strings', body: 'URL `?page=2&limit=10` → `req.query.page`, `req.query.limit`.' },
        { heading: 'Async Routes', body: 'Wrap handlers: `asyncHandler(async (req, res) => { const data = await fetchData(); res.json(data); })`' },
      ]
    },
    {
      title: 'REST API Best Practices — freeCodeCamp',
      url: 'https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/',
      description: 'Design principles for building clean, scalable RESTful APIs.',
      emoji: '📐',
      quickStart: [
        { heading: 'HTTP Methods', body: 'GET (read), POST (create), PUT/PATCH (update), DELETE (remove).' },
        { heading: 'Status Codes', body: '200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error.' },
        { heading: 'Naming', body: 'Use nouns, not verbs: `/users` not `/getUsers`. Plural for collections.' },
        { heading: 'Authentication', body: 'JWT in `Authorization: Bearer <token>` header. Refresh tokens for long sessions.' },
      ]
    }
  ],

  // ─── Next.js ─────────────────────────────────────────────────────────────
  nextjs: [
    {
      title: 'Next.js Official Documentation',
      url: 'https://nextjs.org/docs',
      description: 'Official docs — App Router, Server Components, API Routes, and more.',
      emoji: '▲',
      quickStart: [
        { heading: 'Create', body: '`npx create-next-app@latest my-app --typescript --tailwind`' },
        { heading: 'App Router', body: '`app/page.tsx` → `/`, `app/blog/page.tsx` → `/blog`. File-based routing.' },
        { heading: 'Server Components', body: 'Default: no client JS. Add `"use client"` for interactivity. Fetch data directly in components.' },
        { heading: 'API Routes', body: '`app/api/users/route.ts` → `export async function GET(req) { return Response.json({}) }`' },
      ]
    },
    {
      title: 'Next.js Learn — Official Tutorial',
      url: 'https://nextjs.org/learn',
      description: 'Official interactive course — build a full-stack dashboard app step-by-step.',
      emoji: '📗',
      quickStart: [
        { heading: 'Image', body: '`<Image src="/photo.jpg" width={500} height={300} alt="..." />` — auto-optimized.' },
        { heading: 'Metadata', body: '`export const metadata = { title: "My App", description: "..." };`' },
        { heading: 'Loading UI', body: 'Create `loading.tsx` alongside `page.tsx` for automatic Suspense streaming.' },
        { heading: 'Auth', body: 'Use NextAuth.js (Auth.js): `npm install next-auth` with providers (Google, GitHub, Credentials).' },
      ]
    },
    {
      title: 'Vercel Platform — Next.js Deployment',
      url: 'https://vercel.com/docs',
      description: 'Deploy Next.js to Vercel — zero config, edge network, and preview deployments.',
      emoji: '🚀',
      quickStart: [
        { heading: 'Deploy', body: '`npm install -g vercel && vercel` — auto-detects Next.js and deploys.' },
        { heading: 'Env Vars', body: 'Set in vercel.com dashboard → Settings → Environment Variables.' },
        { heading: 'Edge Functions', body: 'Add `export const runtime = "edge";` to API routes for global low-latency.' },
        { heading: 'Preview URLs', body: 'Every git push creates a unique preview URL — perfect for code review.' },
      ]
    }
  ],

  // ─── Vue.js ──────────────────────────────────────────────────────────────
  vue: [
    {
      title: 'Vue.js Official Documentation',
      url: 'https://vuejs.org/guide/introduction.html',
      description: 'Official Vue 3 guide — Composition API, reactivity, and components.',
      emoji: '💚',
      quickStart: [
        { heading: 'Create', body: '`npm create vue@latest` — Vue 3 + Vite scaffold.' },
        { heading: 'Component', body: '`<script setup> const msg = ref("Hello"); </script> <template>{{ msg }}</template>`' },
        { heading: 'v-model', body: '`<input v-model="name" />` — two-way binding.' },
        { heading: 'Computed', body: '`const double = computed(() => count.value * 2);`' },
      ]
    },
    {
      title: 'Vue Mastery — Free Courses',
      url: 'https://www.vuemastery.com/courses/',
      description: 'High-quality Vue courses — Intro to Vue 3, Composition API, and more.',
      emoji: '🎓',
      quickStart: [
        { heading: 'Directives', body: 'v-if, v-else, v-for, v-on (@), v-bind (:), v-show — template directives.' },
        { heading: 'Emit', body: '`const emit = defineEmits(["update"]); emit("update", newVal);`' },
        { heading: 'Props', body: '`const props = defineProps({ title: String, count: Number });`' },
        { heading: 'Lifecycle', body: 'onMounted, onUnmounted, onBeforeUpdate — Composition API equivalents of Vue 2 hooks.' },
      ]
    },
    {
      title: 'Nuxt.js Documentation',
      url: 'https://nuxt.com/docs',
      description: 'The Vue meta-framework — SSR, SSG, auto-imports, and file-based routing.',
      emoji: '🌿',
      quickStart: [
        { heading: 'Create', body: '`npx nuxi@latest init my-app`' },
        { heading: 'Pages', body: '`pages/index.vue` → `/`. `pages/about.vue` → `/about`. Auto-router.' },
        { heading: 'Composables', body: 'Auto-imported: `useFetch()`, `useRouter()`, `useRuntimeConfig()`' },
        { heading: 'Deploy', body: '`nuxt build` for SSR, `nuxt generate` for static site.' },
      ]
    }
  ],

  // ─── Data Structures & Algorithms ────────────────────────────────────────
  'data structures': [
    {
      title: 'Visualgo — Algorithm Visualizations',
      url: 'https://visualgo.net',
      description: 'Interactive visualizations of data structures and algorithms.',
      emoji: '📊',
      quickStart: [
        { heading: 'Arrays', body: 'O(1) access, O(n) insert/delete. Best for indexed access and iteration.' },
        { heading: 'Linked List', body: 'O(1) insert at head, O(n) access. Good for queues and stacks.' },
        { heading: 'Hash Map', body: 'O(1) average get/set/delete. Key → hash → bucket. Watch for collisions.' },
        { heading: 'Tree', body: 'BST: O(log n) search/insert. BFS/DFS traversal. Used in file systems, parsers.' },
      ]
    },
    {
      title: 'LeetCode — Practice Problems',
      url: 'https://leetcode.com/problemset/',
      description: 'The go-to platform for coding interview preparation with 2000+ problems.',
      emoji: '🧠',
      quickStart: [
        { heading: 'Big O', body: 'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) — always aim for O(n log n) or better.' },
        { heading: 'Two Pointers', body: 'Solve array/string problems without extra space. Start at both ends, move inward.' },
        { heading: 'Sliding Window', body: 'Fixed/variable window over array. Avoid nested loops for subarray problems.' },
        { heading: 'Dynamic Programming', body: 'Break into subproblems, memoize results. Recognize overlapping subproblems.' },
      ]
    },
    {
      title: 'GeeksforGeeks — DSA Self Paced',
      url: 'https://www.geeksforgeeks.org/data-structures/',
      description: 'Comprehensive DSA tutorials with implementation examples in multiple languages.',
      emoji: '🏫',
      quickStart: [
        { heading: 'Stack', body: 'LIFO. Push/pop in O(1). Use for: brackets matching, undo/redo, DFS.' },
        { heading: 'Queue', body: 'FIFO. Enqueue/dequeue in O(1). Use for: BFS, task schedulers.' },
        { heading: 'Graph', body: 'Vertices + Edges. Represent as adjacency list. BFS for shortest path (unweighted).' },
        { heading: 'Heap', body: 'Min/Max heap. O(log n) insert, O(1) peek. Used in priority queues, Dijkstra.' },
      ]
    }
  ],

  // ─── GraphQL ─────────────────────────────────────────────────────────────
  graphql: [
    {
      title: 'GraphQL Official Documentation',
      url: 'https://graphql.org/learn/',
      description: 'Official GraphQL spec and learning guide.',
      emoji: '◈',
      quickStart: [
        { heading: 'Query', body: '`query { user(id: "1") { name email posts { title } } }` — request exactly what you need.' },
        { heading: 'Mutation', body: '`mutation { createPost(title: "Hi", content: "...") { id title } }`' },
        { heading: 'Schema', body: '`type User { id: ID! name: String! posts: [Post!]! }`' },
        { heading: 'Resolver', body: '`Query: { user: (_, { id }) => User.findById(id) }`' },
      ]
    },
    {
      title: 'Apollo GraphQL Documentation',
      url: 'https://www.apollographql.com/docs/',
      description: 'Apollo Server (backend) + Apollo Client (React) — the most popular GraphQL stack.',
      emoji: '🚀',
      quickStart: [
        { heading: 'Apollo Server', body: '`const server = new ApolloServer({ typeDefs, resolvers }); await server.start();`' },
        { heading: 'Apollo Client', body: '`const client = new ApolloClient({ uri: "/graphql", cache: new InMemoryCache() });`' },
        { heading: 'useQuery', body: '`const { data, loading, error } = useQuery(GET_USER);`' },
        { heading: 'useMutation', body: '`const [createPost] = useMutation(CREATE_POST); createPost({ variables: { title } });`' },
      ]
    },
    {
      title: 'The Guild — GraphQL Tools',
      url: 'https://the-guild.dev/graphql',
      description: 'Open-source GraphQL tooling ecosystem — Code Generator, Yoga, Hive.',
      emoji: '⚙️',
      quickStart: [
        { heading: 'Code Gen', body: '`npx graphql-codegen` — auto-generates TypeScript types from your schema.' },
        { heading: 'Fragments', body: 'Reusable query pieces: `fragment UserFields on User { id name email }`' },
        { heading: 'Subscriptions', body: 'Real-time updates over WebSocket: `subscription { newMessage { body author } }`' },
        { heading: 'Directives', body: '`@deprecated(reason: "Use newField")`, `@include(if: $condition)`, `@skip(if: $cond)`' },
      ]
    }
  ],

  // ─── Algorithms ──────────────────────────────────────────────────────────
  algorithms: [
    {
      title: 'Khan Academy — Algorithms Course',
      url: 'https://www.khanacademy.org/computing/computer-science/algorithms',
      description: 'Free visual course covering searching, sorting, graph algorithms.',
      emoji: '🔢',
      quickStart: [
        { heading: 'Binary Search', body: 'O(log n). Array must be sorted. Cut search space in half each step.' },
        { heading: 'Bubble Sort', body: 'O(n²). Simple, rarely used in production. Good for learning.' },
        { heading: 'Merge Sort', body: 'O(n log n). Divide → sort halves → merge. Stable. Great for linked lists.' },
        { heading: 'QuickSort', body: 'O(n log n) avg. Pick pivot → partition → recurse. In-place, cache-friendly.' },
      ]
    },
    {
      title: 'Algorithms Part I — Princeton (Coursera)',
      url: 'https://www.coursera.org/learn/algorithms-part1',
      description: 'World-class algorithms course by Robert Sedgewick — free to audit.',
      emoji: '🎓',
      quickStart: [
        { heading: 'Union-Find', body: 'Track connected components. Use for: network connectivity, percolation.' },
        { heading: 'Priority Queue', body: 'Binary heap: O(log n) insert, O(log n) delete-max. Powers heap sort.' },
        { heading: 'Symbol Tables', body: 'Key-value stores. BST gives O(log n) ops. Hash tables give O(1) amortized.' },
        { heading: 'Graph Search', body: 'BFS: shortest path. DFS: cycle detection, topological sort, connected components.' },
      ]
    },
    {
      title: 'CP-Algorithms — Competitive Programming Reference',
      url: 'https://cp-algorithms.com',
      description: 'Advanced algorithms reference for competitive programming.',
      emoji: '⚡',
      quickStart: [
        { heading: 'Dijkstra', body: 'Shortest path from source with non-negative weights. O((V + E) log V) with priority queue.' },
        { heading: 'Floyd-Warshall', body: 'All-pairs shortest paths. O(V³). Small graphs only. Handles negative edges.' },
        { heading: 'Segment Tree', body: 'Range queries in O(log n). Range sum, range min/max.' },
        { heading: 'DP Patterns', body: 'Knapsack, LIS, LCS, Matrix Chain — recognize these for interview success.' },
      ]
    }
  ],

  // More subjects as fallback...
  default: null
};

/**
 * Normalize subject string for lookup
 */
function normalizeSubject(subject) {
  return subject.toLowerCase().trim()
    .replace(/\.js$/, 'js')
    .replace(/^node\.js$/, 'nodejs')
    .replace(/^next\.js$/, 'nextjs')
    .replace(/\bml\b/, 'machine learning')
    .replace(/\bds\b/, 'data structures')
    .replace(/\bdsa\b/, 'data structures')
    .replace(/\bts\b/, 'typescript');
}

/**
 * Find best matching subject in knowledge base
 */
function findSubject(subject) {
  const normalized = normalizeSubject(subject);
  
  // Exact match
  if (KNOWLEDGE_BASE[normalized]) return { key: normalized, resources: KNOWLEDGE_BASE[normalized] };
  
  // Partial match
  for (const key of Object.keys(KNOWLEDGE_BASE)) {
    if (key === 'default') continue;
    if (normalized.includes(key) || key.includes(normalized)) {
      return { key, resources: KNOWLEDGE_BASE[key] };
    }
  }
  
  return null;
}

/**
 * Fallback resources for unknown subjects
 */
function generateFallbackResources(subject) {
  const capitalized = subject.charAt(0).toUpperCase() + subject.slice(1);
  return [
    {
      title: `${capitalized} — Official Documentation`,
      url: `https://www.google.com/search?q=${encodeURIComponent(subject + ' official documentation')}`,
      description: `Search for the official ${capitalized} documentation.`,
      emoji: '📖',
      quickStart: [
        { heading: 'Getting Started', body: `Search for "${subject} getting started tutorial" to find beginner guides.` },
        { heading: 'Official Docs', body: `Look for the official ${capitalized} website — it's usually the most reliable source.` },
        { heading: 'Community', body: 'Check Reddit, Stack Overflow, and Discord communities for this topic.' },
        { heading: 'Practice', body: 'Build small projects to cement your understanding after reading the docs.' },
      ]
    },
    {
      title: `${capitalized} Tutorial — freeCodeCamp`,
      url: `https://www.google.com/search?q=${encodeURIComponent(subject + ' tutorial freecodecamp')}`,
      description: `Free ${capitalized} learning resources on freeCodeCamp.`,
      emoji: '🎓',
      quickStart: [
        { heading: 'Install', body: `Search for "${subject} installation guide" to get started on your machine.` },
        { heading: 'Fundamentals', body: 'Master the core concepts before moving to advanced topics.' },
        { heading: 'Projects', body: 'Build 3 small projects to solidify understanding of the fundamentals.' },
        { heading: 'Community', body: 'Join the freeCodeCamp forum for help and guidance.' },
      ]
    },
    {
      title: `${capitalized} Crash Course — YouTube`,
      url: `https://www.google.com/search?q=${encodeURIComponent(subject + ' crash course youtube')}`,
      description: `Video tutorials and crash courses for ${capitalized}.`,
      emoji: '🎬',
      quickStart: [
        { heading: 'Watch & Code', body: 'Pause the video, try it yourself, then continue. Active learning beats passive watching.' },
        { heading: 'Take Notes', body: 'Write down key concepts and commands as you watch.' },
        { heading: 'Hands-on', body: `Set up a practice environment for ${capitalized} and experiment freely.` },
        { heading: 'Teach Back', body: 'Explain what you learned to someone else — or write a blog post.' },
      ]
    }
  ];
}

/**
 * ─── CONTEXT-AWARE RESOURCE REFINEMENT MAPS ──────────────────────────────────
 *
 * For subjects that have sub-topics (e.g. "auth" under React vs Express vs Django),
 * these maps redirect the lookup to a more specific knowledge base entry based on
 * what's detected in the user's live context.
 */
const CONTEXT_REFINEMENT = {
  auth: [
    { signals: ['express', 'node', 'mern', 'jwt', 'bcrypt', 'backend'],  subject: 'express' },
    { signals: ['react', 'frontend', 'nextjs', 'next.js'],               subject: 'react'   },
    { signals: ['python', 'django', 'flask'],                             subject: 'python'  },
    { signals: ['mongodb', 'mongoose'],                                   subject: 'mongodb' },
  ],
  routing: [
    { signals: ['express', 'node', 'backend'],    subject: 'express'    },
    { signals: ['react', 'frontend'],             subject: 'react'      },
    { signals: ['nextjs', 'next'],                subject: 'nextjs'     },
    { signals: ['vue', 'nuxt'],                   subject: 'vue'        },
  ],
  database: [
    { signals: ['mongo', 'mern', 'node', 'mongoose'], subject: 'mongodb'     },
    { signals: ['sql', 'postgres', 'relational'],     subject: 'sql'         },
    { signals: ['python', 'django'],                  subject: 'python'      },
  ],
  testing: [
    { signals: ['react', 'frontend'],    subject: 'react'      },
    { signals: ['node', 'express'],      subject: 'nodejs'     },
    { signals: ['python'],               subject: 'python'      },
    { signals: ['typescript', 'ts'],     subject: 'typescript' },
  ],
  deployment: [
    { signals: ['docker', 'container'],  subject: 'docker'     },
    { signals: ['next', 'nextjs'],       subject: 'nextjs'     },
    { signals: ['node', 'express'],      subject: 'nodejs'     },
  ],
  styling: [
    { signals: ['react', 'frontend'],    subject: 'css'        },
    { signals: ['tailwind'],             subject: 'css'        },
    { signals: ['vue'],                  subject: 'css'        },
  ],
  hooks: [
    { signals: ['react', 'frontend'],    subject: 'react'      },
    { signals: ['vue'],                  subject: 'vue'        },
  ],
  state: [
    { signals: ['react', 'frontend'],    subject: 'react'      },
    { signals: ['vue'],                  subject: 'vue'        },
    { signals: ['typescript'],           subject: 'typescript' },
  ],
};

/**
 * Build a flat signal string from all live context data.
 */
function buildContextSignals(liveContext) {
  if (!liveContext) return '';
  const parts = [];
  if (liveContext.activeWorkspace) {
    parts.push(liveContext.activeWorkspace.name || '');
    parts.push(liveContext.activeWorkspace.dailyFocus || '');
    parts.push(liveContext.activeWorkspace.sessionNote || '');
    (liveContext.activeWorkspace.urls || []).forEach(u => parts.push(u));
  }
  (liveContext.recentTabs || []).forEach(tab => {
    parts.push(tab.current_tab_url || '');
    parts.push(tab.page_title || '');
  });
  return parts.join(' ').toLowerCase();
}

/**
 * Refine subject lookup using context signals.
 * Returns the refined subject key if a match is found, otherwise null.
 */
function refineSubject(normalizedSubject, signals) {
  const refinements = CONTEXT_REFINEMENT[normalizedSubject];
  if (!refinements || !signals) return null;
  for (const rule of refinements) {
    if (rule.signals.some(sig => signals.includes(sig))) {
      return rule.subject;
    }
  }
  return null;
}

/**
 * Generate a 2-sentence contextual_summary explaining WHY each resource
 * is relevant to the user's current task.
 */
function generateContextualSummary(resource, subject, liveContext) {
  if (!liveContext || (!liveContext.activeWorkspace && liveContext.recentTabs.length === 0)) {
    return resource.description;
  }

  const workspaceName = liveContext.activeWorkspace?.name || null;
  const workspaceFocus = liveContext.activeWorkspace?.dailyFocus || null;
  const recentTitles = (liveContext.recentTabs || [])
    .map(t => t.page_title)
    .filter(Boolean)
    .slice(0, 2)
    .join(' and ');

  // Build contextual sentence 1 — what the user is doing
  let sentence1 = '';
  if (workspaceName && workspaceFocus) {
    sentence1 = `You are currently working on the "${workspaceName}" workspace with "${workspaceFocus}" as your focus.`;
  } else if (workspaceName) {
    sentence1 = `You are currently in the "${workspaceName}" workspace.`;
  } else if (recentTitles) {
    sentence1 = `You were recently browsing: ${recentTitles}.`;
  } else {
    sentence1 = 'Based on your active development session:';
  }

  // Build contextual sentence 2 — why THIS resource helps
  const subjectCap = subject.charAt(0).toUpperCase() + subject.slice(1);
  const title = resource.title.split('—')[0].trim();

  let sentence2 = `${title} is directly relevant to your task`;
  if (workspaceFocus) {
    sentence2 += `, especially for understanding ${workspaceFocus}`;
  }
  if (recentTitles) {
    sentence2 += ` — complementing what you were just reading about`;
  }
  sentence2 += '.';

  return `${sentence1} ${sentence2}`;
}

/**
 * Derive a human-readable inferred_focus label for the Live Context UI.
 */
function deriveInferredFocus(subject, refinedSubject, liveContext) {
  const workspaceName = liveContext?.activeWorkspace?.name;
  const workspaceFocus = liveContext?.activeWorkspace?.dailyFocus;

  const displaySubject = refinedSubject
    ? refinedSubject.charAt(0).toUpperCase() + refinedSubject.slice(1)
    : subject.charAt(0).toUpperCase() + subject.slice(1);

  if (workspaceFocus && workspaceName) {
    return `${displaySubject} — ${workspaceFocus} (${workspaceName})`;
  }
  if (workspaceName) {
    return `${displaySubject} in ${workspaceName} Workspace`;
  }
  if ((liveContext?.recentTabs || []).length > 0) {
    const latestTitle = liveContext.recentTabs[0]?.page_title || '';
    if (latestTitle) return `${displaySubject} — while reviewing ${latestTitle}`;
  }
  return `${displaySubject} Documentation`;
}

/**
 * Main agent function — context-aware search returning top 3 resources
 * with contextual_summary and inferred_focus.
 *
 * @param {string} subject - The topic the user typed
 * @param {object|null} liveContext - { activeWorkspace, recentTabs } from contextEnrichMiddleware
 */
async function searchSubject(subject, liveContext = null) {
  if (!subject || typeof subject !== 'string') {
    throw new Error('Subject must be a non-empty string');
  }

  const trimmed = subject.trim();
  const contextSignals = buildContextSignals(liveContext);

  // Step 1: Try exact/partial match on the raw subject
  let match = findSubject(trimmed);
  let refinedSubject = null;

  // Step 2: If this is a refinement-eligible subject AND context exists,
  //         redirect to the more specific knowledge base entry
  if (match && CONTEXT_REFINEMENT[match.key] && contextSignals) {
    const refined = refineSubject(match.key, contextSignals);
    if (refined && KNOWLEDGE_BASE[refined]) {
      refinedSubject = refined;
      match = { key: refined, resources: KNOWLEDGE_BASE[refined] };
    }
  }

  // Step 3: If no direct match, try to find by context signals alone
  if (!match && contextSignals) {
    const refinedFromContext = refineSubject(normalizeSubject(trimmed), contextSignals);
    if (refinedFromContext && KNOWLEDGE_BASE[refinedFromContext]) {
      refinedSubject = refinedFromContext;
      match = { key: refinedFromContext, resources: KNOWLEDGE_BASE[refinedFromContext] };
    }
  }

  // Step 4: Attach contextual_summary to every resource
  const enrichResources = (resources) => resources.map(resource => ({
    ...resource,
    contextual_summary: generateContextualSummary(resource, trimmed, liveContext)
  }));

  const inferred_focus = deriveInferredFocus(trimmed, refinedSubject, liveContext);

  if (match) {
    return {
      subject: trimmed,
      normalizedSubject: match.key,
      refinedFrom: refinedSubject,
      inferred_focus,
      resources: enrichResources(match.resources),
      fromCache: false,
      found: true
    };
  }

  return {
    subject: trimmed,
    normalizedSubject: normalizeSubject(trimmed),
    refinedFrom: null,
    inferred_focus,
    resources: enrichResources(generateFallbackResources(trimmed)),
    fromCache: false,
    found: false
  };
}

module.exports = { searchSubject, normalizeSubject };

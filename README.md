<h1 align="center">🌌 Aurora — Self-Hosted Server Admin Panel</h1>

<p align="center">
  <strong>A dark-themed, self-hosted server administration dashboard.</strong>
</p>

<p align="center">
  Simple • Secure • Cost-Efficient
</p>

<hr/>

<h2>🚀 Overview</h2>

<p>
Aurora is a <strong>self-hosted server administration dashboard</strong> designed to monitor,
manage, and control services running on personal or small-scale servers.
It prioritizes <strong>clarity, stability, and performance</strong> while avoiding expensive cloud dependencies.
</p>

<p>
Aurora acts as the <strong>central command center</strong> for the <strong>fyxhub</strong> ecosystem.
</p>

<hr/>

<h2>✨ Features</h2>

<ul>
  <li>📊 <strong>Real-Time Monitoring</strong>
    <ul>
      <li>CPU, RAM, Disk, Network usage</li>
      <li>Smooth charts and usage indicators</li>
    </ul>
  </li>

  <li>🧩 <strong>Service Management</strong>
    <ul>
      <li>View running / stopped services</li>
      <li>Restart or manage services from the UI</li>
    </ul>
  </li>

  <li>📜 <strong>Centralized Logs</strong>
    <ul>
      <li>System and application logs</li>
      <li>Clean and readable log viewer</li>
    </ul>
  </li>

  <li>🔐 <strong>Secure Admin Access</strong>
    <ul>
      <li>Authentication-protected interface</li>
      <li>Role-ready architecture</li>
    </ul>
  </li>

  <li>🌙 <strong>Single Dark Theme</strong>
    <ul>
      <li>No light mode</li>
      <li>Optimized for long monitoring sessions</li>
    </ul>
  </li>

  <li>🖥️ <strong>Self-Hosted & Cost-Efficient</strong>
    <ul>
      <li>Runs on personal hardware</li>
      <li>No mandatory cloud dependencies</li>
      <li>Designed for 24/7 uptime</li>
    </ul>
  </li>
</ul>

<hr/>

<h2>🧠 Design Philosophy</h2>

<ul>
  <li>Clarity over clutter</li>
  <li>Stability over flash</li>
  <li>Trends over raw numbers</li>
  <li>Admin-first UX</li>
</ul>

<blockquote>
  <em>“What is happening on my server right now?”</em>
</blockquote>

<hr/>

<h2>🏗️ Architecture Overview</h2>

<h3>Frontend</h3>
<ul>
  <li>React (JavaScript)</li>
  <li>Vite</li>
  <li>React Icons</li>
  <li>Static hosting (Vercel / Netlify)</li>
  <li>Dark theme only</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Self-hosted on personal server</li>
  <li>REST APIs</li>
  <li>Database & lightweight LLMs hosted locally</li>
  <li>Secure reverse tunnel exposure</li>
</ul>

<h3>Server</h3>
<ul>
  <li>Ubuntu Server (no GUI)</li>
  <li>Docker-ready architecture</li>
  <li>Built for future expansion</li>
</ul>

<hr/>

<h2>📁 Project Structure</h2>

<pre>
aurora-admin/
├── public/
├── src/
│   ├── api/          # API communication layer
│   ├── components/   # Layout, UI, charts
│   ├── context/      # Global state
│   ├── hooks/        # Polling & logic
│   ├── pages/        # Application pages
│   ├── styles/       # Global & theme styles
│   ├── utils/        # Helpers
│   ├── App.js        # App entry & routing
│   └── main.jsx
├── index.html
└── README.md
</pre>

<hr/>

<h2>🔄 Application Flow</h2>

<ol>
  <li>User opens the admin URL</li>
  <li>Authentication check</li>
  <li>Dashboard loads with live server status</li>
  <li>Navigation via sidebar:
    <ul>
      <li>Dashboard</li>
      <li>Services</li>
      <li>Logs</li>
      <li>Resources</li>
      <li>Storage</li>
      <li>Security</li>
      <li>Settings</li>
    </ul>
  </li>
  <li>Continuous polling updates the UI</li>
  <li>Secure logout ends the session</li>
</ol>

<hr/>

<h2>🛡️ Security Model</h2>

<ul>
  <li>Protected admin routes</li>
  <li>Backend isolated from frontend hosting</li>
  <li>No public server exposure</li>
  <li>Designed to work behind CGNAT</li>
  <li>Reverse-tunnel ready (Cloudflare or alternatives)</li>
</ul>

<hr/>

<h2>🚀 Deployment Strategy</h2>

<h3>Frontend</h3>
<ul>
  <li>Deployed using Vercel / Netlify</li>
  <li>Static build, zero backend exposure</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Hosted on personal Ubuntu Server</li>
  <li>Exposed via secure reverse tunnel</li>
  <li>No static IP required</li>
</ul>

<p>
<strong>Result:</strong> Near-zero hosting cost.
</p>

<hr/>

<h2>🔮 Roadmap</h2>

<ul>
  <li>Docker-based service orchestration</li>
  <li>Kubernetes support (optional)</li>
  <li>Alerting system (email / webhook)</li>
  <li>Multi-server monitoring</li>
  <li>Role-based access control</li>
  <li>Mobile-friendly admin UI</li>
</ul>

<hr/>

<h2>🤝 Contributors</h2>

<ul>
  <li><strong>Monic Auditya A</strong> — Architecture & Deployment </li>
  <li><strong>Manoharan</strong> — Frontend UI & UX </li>
  <li><strong>Team:</strong> Manoic </li>
</ul>

<hr/>

<h2>📜 License</h2>

<p>
This project is under active development.
A license will be added after the first stable release.
</p>

<hr/>

<h2>🧭 Final Note</h2>

<p>
Aurora is not just a dashboard.
</p>

<p>
<strong>It is the command center for your infrastructure.</strong>
</p>

<p align="center">
  <strong>Simple • Dark • Powerful</strong>
</p>

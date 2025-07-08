import React, { useState, useEffect } from 'react';

// Use VITE_ADMIN_PASSWORD from env, fallback to default
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'root';

const AdminPanel = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [error, setError] = useState('');

  // Data states
  const [generations, setGenerations] = useState([]);
  const [stats, setStats] = useState(null);
  const [errors, setErrors] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabError, setTabError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  // Fetch data for each tab
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    setTabError('');
    if (tab === 'dashboard') {
      fetch('/api/admin/generations')
        .then(r => r.json())
        .then(setGenerations)
        .catch(() => setTabError('Failed to load generations'))
        .finally(() => setLoading(false));
    } else if (tab === 'stats') {
      fetch('/api/admin/stats')
        .then(r => r.json())
        .then(setStats)
        .catch(() => setTabError('Failed to load stats'))
        .finally(() => setLoading(false));
    } else if (tab === 'errors') {
      fetch('/api/admin/errors')
        .then(r => r.json())
        .then(setErrors)
        .catch(() => setTabError('Failed to load errors'))
        .finally(() => setLoading(false));
    } else if (tab === 'config') {
      fetch('/api/admin/config')
        .then(r => r.json())
        .then(setConfig)
        .catch(() => setTabError('Failed to load config'))
        .finally(() => setLoading(false));
    }
  }, [tab, authed]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--md3-bg)]">
        <form onSubmit={handleLogin} className="bg-white dark:bg-[var(--md3-surface)] p-8 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-xs">
          <h2 className="text-xl font-bold mb-2 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="md3-input"
            autoFocus
          />
          {error && <div className="text-red-500 text-xs text-center">{error}</div>}
          <button type="submit" className="md3-btn w-full">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--md3-bg)] text-[var(--md3-text)] flex flex-col">
      <header className="p-4 border-b border-[var(--md3-border)] flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button className="md3-btn" onClick={() => setAuthed(false)}>Logout</button>
      </header>
      <nav className="flex gap-2 p-4 border-b border-[var(--md3-border)]">
        <button className={`md3-tab${tab === 'dashboard' ? ' selected' : ''}`} onClick={() => setTab('dashboard')}>Dashboard</button>
        <button className={`md3-tab${tab === 'stats' ? ' selected' : ''}`} onClick={() => setTab('stats')}>API Stats</button>
        <button className={`md3-tab${tab === 'errors' ? ' selected' : ''}`} onClick={() => setTab('errors')}>Error Logs</button>
        <button className={`md3-tab${tab === 'config' ? ' selected' : ''}`} onClick={() => setTab('config')}>Config</button>
      </nav>
      <main className="flex-1 p-6 overflow-auto">
        {loading && <div className="text-center text-[var(--md3-secondary)]">Loading...</div>}
        {tabError && <div className="text-center text-red-500">{tabError}</div>}
        {/* Dashboard: Generations */}
        {tab === 'dashboard' && !loading && !tabError && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Generations</h2>
            {generations.length === 0 ? (
              <div className="text-[var(--md3-secondary)]">No generations yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-xs md:text-sm">
                  <thead>
                    <tr className="bg-[var(--md3-surface)]">
                      <th className="p-2 border">Time</th>
                      <th className="p-2 border">Prompt</th>
                      <th className="p-2 border">Style</th>
                      <th className="p-2 border">Aspect</th>
                      <th className="p-2 border">Image</th>
                      <th className="p-2 border">Success</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generations.slice(0, 50).map((g, i) => (
                      <tr key={i} className="hover:bg-[var(--md3-hover)]">
                        <td className="p-2 border whitespace-nowrap">{new Date(g.timestamp).toLocaleString()}</td>
                        <td className="p-2 border max-w-xs truncate" title={g.prompt}>{g.prompt}</td>
                        <td className="p-2 border">{g.style_preset}</td>
                        <td className="p-2 border">{g.aspect_ratio}</td>
                        <td className="p-2 border">
                          {g.image_url ? <a href={g.image_url} target="_blank" rel="noopener noreferrer"><img src={g.image_url} alt="gen" className="w-16 h-10 object-cover rounded" /></a> : <span className="text-gray-400">N/A</span>}
                        </td>
                        <td className="p-2 border text-center">{g.success ? '✅' : '❌'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* Stats */}
        {tab === 'stats' && !loading && !tabError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--md3-surface)] rounded-lg p-6 shadow">
              <div className="text-lg font-semibold">Total Generations</div>
              <div className="text-3xl font-bold">{stats?.totalGenerations ?? '-'}</div>
            </div>
            <div className="bg-[var(--md3-surface)] rounded-lg p-6 shadow">
              <div className="text-lg font-semibold">Total Errors</div>
              <div className="text-3xl font-bold">{stats?.totalErrors ?? '-'}</div>
            </div>
            <div className="bg-[var(--md3-surface)] rounded-lg p-6 shadow col-span-2">
              <div className="text-lg font-semibold mb-2">Last Generation</div>
              {stats?.lastGeneration ? (
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {stats.lastGeneration.image_url && <img src={stats.lastGeneration.image_url} alt="last" className="w-24 h-16 object-cover rounded" />}
                  <div>
                    <div><b>Prompt:</b> {stats.lastGeneration.prompt}</div>
                    <div><b>Style:</b> {stats.lastGeneration.style_preset}</div>
                    <div><b>Aspect:</b> {stats.lastGeneration.aspect_ratio}</div>
                    <div><b>Time:</b> {new Date(stats.lastGeneration.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ) : <div className="text-[var(--md3-secondary)]">No generations yet.</div>}
            </div>
            <div className="bg-[var(--md3-surface)] rounded-lg p-6 shadow col-span-2">
              <div className="text-lg font-semibold mb-2">Last Error</div>
              {stats?.lastError ? (
                <div>
                  <div><b>Time:</b> {new Date(stats.lastError.timestamp).toLocaleString()}</div>
                  <div><b>Status:</b> {stats.lastError.status}</div>
                  <div><b>Error:</b> {stats.lastError.error}</div>
                </div>
              ) : <div className="text-[var(--md3-secondary)]">No errors yet.</div>}
            </div>
          </div>
        )}
        {/* Errors */}
        {tab === 'errors' && !loading && !tabError && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Error Logs</h2>
            {errors.length === 0 ? (
              <div className="text-[var(--md3-secondary)]">No errors logged.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-xs md:text-sm">
                  <thead>
                    <tr className="bg-[var(--md3-surface)]">
                      <th className="p-2 border">Time</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Error</th>
                      <th className="p-2 border">Prompt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.slice(0, 50).map((e, i) => (
                      <tr key={i} className="hover:bg-[var(--md3-hover)]">
                        <td className="p-2 border whitespace-nowrap">{new Date(e.timestamp).toLocaleString()}</td>
                        <td className="p-2 border">{e.status}</td>
                        <td className="p-2 border max-w-xs truncate" title={e.error}>{e.error}</td>
                        <td className="p-2 border max-w-xs truncate" title={e.payload?.video_description || ''}>{e.payload?.video_description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* Config */}
        {tab === 'config' && !loading && !tabError && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Config</h2>
            {config ? (
              <div className="bg-[var(--md3-surface)] rounded-lg p-6 shadow text-sm">
                <div><b>API_BASE_URL:</b> {config.API_BASE_URL}</div>
                <div className="mt-2"><b>DEFAULT_PARAMS:</b>
                  <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 mt-1 overflow-x-auto">{JSON.stringify(config.DEFAULT_PARAMS, null, 2)}</pre>
                </div>
              </div>
            ) : <div className="text-[var(--md3-secondary)]">No config found.</div>}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel; 
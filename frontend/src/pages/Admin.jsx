import { useState, useEffect } from 'react';
import api from '../api';
import './Admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState([]);
  const [news, setNews] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        api.get('/admin/games'),
        api.get('/admin/news'),
        api.get('/admin/stats'),
        ...(activeTab === 'reports' ? [api.get('/admin/reports')] : [])
      ]);
      setGames(results[0].data);
      setNews(results[1].data);
      setStats(results[2].data);
      if (results[3]) setReports(results[3].data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGame = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/games/${editing}`, form);
      } else {
        await api.post('/admin/games', form);
      }
      setForm({});
      setEditing(null);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/news/${editing}`, form);
      } else {
        await api.post('/admin/news', form);
      }
      setForm({});
      setEditing(null);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/admin/${type}/${id}`);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !stats) return <div className="page-loading">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>Manage games, news, and content</p>
      </div>

      {stats && (
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.gamesCount}</span>
            <span className="stat-label">Games</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.newsCount}</span>
            <span className="stat-label">News</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.usersCount}</span>
            <span className="stat-label">Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.reportsPending ?? 0}</span>
            <span className="stat-label">Signalements en attente</span>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={activeTab === 'games' ? 'active' : ''}
          onClick={() => { setActiveTab('games'); setEditing(null); setForm({}); }}
        >
          Games
        </button>
        <button
          className={activeTab === 'news' ? 'active' : ''}
          onClick={() => { setActiveTab('news'); setEditing(null); setForm({}); }}
        >
          News
        </button>
        <button
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => { setActiveTab('reports'); setEditing(null); setForm({}); }}
        >
          Signalements
        </button>
      </div>

      {activeTab === 'games' && (
        <div className="admin-section">
          <form className="admin-form" onSubmit={handleSaveGame}>
            <h3>{editing ? 'Edit Game' : 'Add Game'}</h3>
            <div className="form-group">
              <input
                placeholder="Name"
                value={form.name || ''}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <input
                placeholder="Developer"
                value={form.developer || ''}
                onChange={e => setForm(f => ({ ...f, developer: e.target.value }))}
              />
              <input
                placeholder="Publisher"
                value={form.publisher || ''}
                onChange={e => setForm(f => ({ ...f, publisher: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <input
                placeholder="Short description"
                value={form.shortDescription || ''}
                onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
              />
            </div>

            <textarea
              placeholder="Description"
              value={form.description || ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
            />

            <div className="form-group">
              <select
                value={form.category || ''}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                <option value="">Category</option>
                {['Action', 'Adventure', 'RPG', 'Sports', 'Racing', 'Shooter', 'Strategy', 'Simulation', 'Horror', 'Indie', 'Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <input
                type="date"
                placeholder="Release date"
                value={form.releaseDate ? form.releaseDate.split('T')[0] : ''}
                onChange={e => setForm(f => ({ ...f, releaseDate: e.target.value }))}
                required
              />
            </div>

            <div className="form-group platforms-group">
              <label>Platforms:</label>
              <div className="platforms-options">
                {['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'].map(p => (
                  <label key={p} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.platforms?.includes(p) || false}
                      onChange={e => {
                        const platforms = form.platforms || [];
                        if (e.target.checked) {
                          setForm(f => ({ ...f, platforms: [...platforms, p] }));
                        } else {
                          setForm(f => ({ ...f, platforms: platforms.filter(Plat => Plat !== p) }));
                        }
                      }}
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <input
                placeholder="Cover image URL"
                value={form.coverImage || ''}
                onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
              />
              <input
                placeholder="Trailer URL (YouTube embed)"
                value={form.trailerUrl || ''}
                onChange={e => setForm(f => ({ ...f, trailerUrl: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <textarea
                placeholder="Screenshots URLs (one per line)"
                value={Array.isArray(form.screenshots) ? form.screenshots.join('\n') : (form.screenshots || '')}
                onChange={e => setForm(f => ({ ...f, screenshots: e.target.value.split('\n') }))}
                rows={3}
              />
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={form.isUpcoming || false}
                  onChange={e => setForm(f => ({ ...f, isUpcoming: e.target.checked }))}
                />
                Upcoming
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.trending || false}
                  onChange={e => setForm(f => ({ ...f, trending: e.target.checked }))}
                />
                Trending
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.featured || false}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                />
                Featured
              </label>
            </div>

            <div className="form-actions">
              <button type="submit">Save</button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({}); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="admin-list">
            {(Array.isArray(games) ? games : []).map(g => (
              <div key={g._id} className="admin-item">
                <img src={g.coverImage} alt="" />
                <div>
                  <strong>{g.name}</strong>
                  <span>{g.category}</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => { setEditing(g._id); setForm(g); }}>Edit</button>
                  <button className="danger" onClick={() => handleDelete('games', g._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'news' && (
        <div className="admin-section">
          <form className="admin-form" onSubmit={handleSaveNews}>
            <h3>{editing ? 'Edit News' : 'Add News'}</h3>
            <input
              placeholder="Title"
              value={form.title || ''}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
            <input
              placeholder="Excerpt"
              value={form.excerpt || ''}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            />
            <textarea
              placeholder="Content"
              value={form.content || ''}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              required
            />
            <select
              value={form.category || ''}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              <option value="">Category</option>
              {['News', 'Review', 'Update', 'Release', 'Industry'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              placeholder="Image URL"
              value={form.image || ''}
              onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
            />
            <label>
              <input
                type="checkbox"
                checked={form.featured || false}
                onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
              />
              Featured
            </label>
            <div className="form-actions">
              <button type="submit">Save</button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({}); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="admin-list">
            {(Array.isArray(news) ? news : []).map(n => (
              <div key={n._id} className="admin-item">
                <img src={n.image} alt="" />
                <div>
                  <strong>{n.title}</strong>
                  <span>{n.category}</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => { setEditing(n._id); setForm(n); }}>Edit</button>
                  <button className="danger" onClick={() => handleDelete('news', n._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="admin-section">
          <h3>Signalements</h3>
          <div className="admin-list reports-list">
            {(Array.isArray(reports) ? reports : []).length === 0 && !loading && <p>Aucun signalement.</p>}
            {(Array.isArray(reports) ? reports : []).map(r => (
              <div key={r._id} className="admin-item report-item">
                <div className="report-info">
                  <span><strong>Par:</strong> {r.reporter?.username ?? r.reporter}</span>
                  <span><strong>Type:</strong> {r.type}</span>
                  <span><strong>Ref:</strong> {r.refId}</span>
                  <span><strong>Motif:</strong> {r.reason}</span>
                  {r.comment && <span><strong>Détails:</strong> {r.comment}</span>}
                  <span><strong>Date:</strong> {new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <div className="item-actions report-actions">
                  <select
                    value={r.status}
                    onChange={async (e) => {
                      const status = e.target.value;
                      try {
                        await api.patch(`/admin/reports/${r._id}`, { status });
                        setReports(prev => (Array.isArray(prev) ? prev : []).map(x => x._id === r._id ? { ...x, status } : x));
                        if (stats && r.status === 'pending' && status !== 'pending') {
                          setStats(s => ({ ...s, reportsPending: Math.max(0, (s.reportsPending ?? 0) - 1) }));
                        }
                      } catch (err) { console.error(err); }
                    }}
                  >
                    <option value="pending">En attente</option>
                    <option value="reviewed">Examiné</option>
                    <option value="resolved">Résolu</option>
                    <option value="dismissed">Rejeté</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

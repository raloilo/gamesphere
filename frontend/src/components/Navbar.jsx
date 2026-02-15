import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/users/notifications').then(res => setNotifications(res.data)).catch(() => { });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">◆</span>
        <span>GameSphere</span>
      </Link>

      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span></span><span></span><span></span>
      </button>

      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/upcoming" onClick={() => setMenuOpen(false)}>Upcoming</Link>
        <Link to="/games" onClick={() => setMenuOpen(false)}>Library</Link>
        <Link to="/news" onClick={() => setMenuOpen(false)}>News</Link>

        {user ? (
          <div className="navbar-user">
            {user.role === 'admin' && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
            )}
            <div className="notif-dropdown">
              <button
                className="nav-btn notif-btn"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (!notifOpen && notifications.some(n => !n.read)) {
                    // Mark all displayed as read (simplification) or mark individually
                    notifications.filter(n => !n.read).forEach(n => {
                      api.patch(`/users/notifications/${n._id}/read`).catch(() => { });
                    });
                    // Optimistically update UI
                    setNotifications(notifications.map(n => ({ ...n, read: true })));
                  }
                }}
                aria-label="Notifications"
              >
                🔔 {notifications.filter(n => !n.read).length > 0 && (
                  <span className="notif-badge">{notifications.filter(n => !n.read).length}</span>
                )}
              </button>
              {notifOpen && (
                <div className="notif-panel">
                  <h4>Notifications</h4>
                  {notifications.length ? notifications.slice(0, 5).map(n => (
                    <div key={n._id} className={`notif-item ${n.read ? '' : 'unread'}`}>
                      <strong>{n.relatedGame?.name || 'System'}</strong>
                      <p>{n.message}</p>
                      <span className="notif-date">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  )) : (
                    <p className="notif-empty">No notifications yet</p>
                  )}
                </div>
              )}
            </div>
            <div className="user-dropdown">
              <button className="nav-btn user-btn">
                {user.username}
              </button>
              <div className="dropdown-content">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Mon profil</Link>
                <Link to="/bookmarks" onClick={() => setMenuOpen(false)}>Mes favoris</Link>
                <button onClick={handleLogout}>Déconnexion</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost">Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

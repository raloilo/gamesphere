import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    avatar: '',
    notifyNewReleases: true,
    notifyUpdates: true
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/users/profile')
      .then((res) => {
        setProfile(res.data);
        setProfileForm({
          username: res.data.username || '',
          email: res.data.email || '',
          avatar: res.data.avatar || '',
          notifyNewReleases: res.data.notifyNewReleases !== false,
          notifyUpdates: res.data.notifyUpdates !== false
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const { data } = await api.put('/users/profile', profileForm);
      setProfile(data);
      if (refreshUser) refreshUser();
      setMessage({ type: 'success', text: 'Profil mis à jour.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour.' });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const { data } = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfileForm(f => ({ ...f, avatar: data.avatar }));
      setProfile(data);
      if (refreshUser) refreshUser();
      setMessage({ type: 'success', text: 'Photo de profil mise à jour.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du téléchargement de la photo.' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit faire au moins 6 caractères.' });
      return;
    }
    try {
      await api.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Mot de passe modifié.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du changement de mot de passe.' });
    }
  };

  if (loading) return <div className="page-loading">Chargement...</div>;

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Mon profil</h1>
        <p>Gérez votre compte et vos préférences</p>
      </div>

      {message.text && (
        <div className={'profile-message ' + message.type}>
          {message.text}
        </div>
      )}

      <section className="profile-section">
        <h2>Informations du compte</h2>
        <form onSubmit={handleProfileSubmit} className="profile-form">
          <label>
            Nom d'utilisateur
            <input
              type="text"
              value={profileForm.username}
              onChange={(e) => setProfileForm((f) => ({ ...f, username: e.target.value }))}
              minLength={3}
              maxLength={30}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </label>
          <label>
            Photo de profil
            <div className="avatar-upload-container">
              <input
                type="url"
                value={profileForm.avatar}
                onChange={(e) => setProfileForm((f) => ({ ...f, avatar: e.target.value }))}
                placeholder="https://... ou télécharger une image"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="file-input"
              />
            </div>
          </label>
          <div className="profile-avatar-preview">
            {profileForm.avatar ? (
              <img src={profileForm.avatar} alt="Aperçu" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span className="avatar-placeholder">{profile && profile.username ? profile.username.charAt(0).toUpperCase() : '?'}</span>
            )}
          </div>
          <label className="profile-checkbox">
            <input
              type="checkbox"
              checked={profileForm.notifyNewReleases}
              onChange={(e) => setProfileForm((f) => ({ ...f, notifyNewReleases: e.target.checked }))}
            />
            Notifications pour les nouvelles sorties
          </label>
          <label className="profile-checkbox">
            <input
              type="checkbox"
              checked={profileForm.notifyUpdates}
              onChange={(e) => setProfileForm((f) => ({ ...f, notifyUpdates: e.target.checked }))}
            />
            Notifications pour les mises à jour de jeux
          </label>
          <button type="submit">Enregistrer les modifications</button>
        </form>
      </section>

      <section className="profile-section">
        <h2>Changer le mot de passe</h2>
        <form onSubmit={handlePasswordSubmit} className="profile-form">
          <label>
            Mot de passe actuel
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
              required
            />
          </label>
          <label>
            Nouveau mot de passe
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              minLength={6}
              required
            />
          </label>
          <label>
            Confirmer le nouveau mot de passe
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              minLength={6}
              required
            />
          </label>
          <button type="submit">Changer le mot de passe</button>
        </form>
      </section>
    </div>
  );
}

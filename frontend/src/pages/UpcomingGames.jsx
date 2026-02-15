import { useState, useEffect } from 'react';
import api from '../api';
import GameCard from '../components/GameCard';
import './UpcomingGames.css';

export default function UpcomingGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/games/upcoming')
      .then(res => setGames(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="upcoming-page">
      <div className="page-header">
        <h1>Upcoming Games</h1>
        <p>Get excited for the next big releases</p>
      </div>
      <div className="upcoming-grid">
        {games.length ? games.map(game => (
          <div key={game._id} className="upcoming-card">
            <GameCard game={game} />
            <div className="upcoming-meta">
              <span className="platforms">{game.platforms?.join(' • ')}</span>
              <span className="release-date">
                {new Date(game.releaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        )) : (
          <p className="empty-state">No upcoming games listed yet.</p>
        )}
      </div>
    </div>
  );
}

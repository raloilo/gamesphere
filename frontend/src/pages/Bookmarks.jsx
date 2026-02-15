import { useState, useEffect } from 'react';
import api from '../api';
import GameCard from '../components/GameCard';
import './Bookmarks.css';

export default function Bookmarks() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/bookmarks')
      .then(res => setGames(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="bookmarks-page">
      <div className="page-header">
        <h1>My Bookmarks</h1>
        <p>Your favorite games</p>
      </div>
      {games.length ? (
        <div className="game-grid">
          {games.map(game => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No bookmarked games yet. Browse the library and bookmark your favorites!</p>
      )}
    </div>
  );
}

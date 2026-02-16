import { useState, useEffect } from 'react';
import api from '../api';
import GameCard from '../components/GameCard';
import './GamesLibrary.css';

const CATEGORIES = ['All', 'Action', 'Adventure', 'RPG', 'Sports', 'Racing', 'Shooter', 'Strategy', 'Simulation', 'Horror', 'Indie'];
const PLATFORMS = ['All', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
const SORT_OPTIONS = [
  { value: '-rating.average', label: 'Highest Rated' },
  { value: '-createdAt', label: 'Newest' },
  { value: '-releaseDate', label: 'Recent Releases' },
  { value: 'name', label: 'Name A-Z' }
];

export default function GamesLibrary() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [platform, setPlatform] = useState('All');
  const [sort, setSort] = useState('-rating.average');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (platform !== 'All') params.set('platform', platform);
    params.set('sort', sort);
    params.set('upcoming', 'false');

    api.get(`/games?${params}`)
      .then(res => setGames(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, platform, sort]);

  return (
    <div className="library-page">
      <div className="page-header">
        <h1>Games Library</h1>
        <p>Discover and explore our curated collection</p>
      </div>

      <div className="library-toolbar">
        <div className="search-box">
          <input
            type="search"
            placeholder="Search games..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={platform} onChange={e => setPlatform(e.target.value)}>
            {PLATFORMS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="page-loading">Loading...</div>
      ) : (
        <div className="game-grid">
          {Array.isArray(games) && games.length ? games.map(game => (
            <GameCard key={game._id} game={game} />
          )) : (
            <p className="empty-state">No games found. Try adjusting your filters.</p>
          )}
        </div>
      )}
    </div>
  );
}

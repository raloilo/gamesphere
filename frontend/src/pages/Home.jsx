import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import GameCard from '../components/GameCard';
import './Home.css';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/games/trending'),
      api.get('/news?limit=5')
    ]).then(([gamesRes, newsRes]) => {
      setTrending(gamesRes.data);
      setNews(newsRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to <span className="gradient-text">GameSphere</span></h1>
          <p>Your ultimate destination for gaming news, reviews, and discoveries.</p>
          <div className="hero-actions">
            <Link to="/games" className="btn-hero">Explore Games</Link>
            <Link to="/upcoming" className="btn-hero outline">Upcoming Releases</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="grid-pattern"></div>
        </div>
      </section>

      <section className="section trending-section">
        <h2>Trending Games</h2>
        <div className="game-grid">
          {trending.map(game => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      </section>

      <section className="section news-section">
        <div className="section-header">
          <h2>Latest News</h2>
          <Link to="/news" className="see-all">See All →</Link>
        </div>
        <div className="news-grid">
          {news.map(item => (
            <Link key={item._id} to="/news" className="news-card">
              <div className="news-card-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="news-card-content">
                <span className="news-category">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

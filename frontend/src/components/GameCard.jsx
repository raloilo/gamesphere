import { Link } from 'react-router-dom';
import './GameCard.css';

export default function GameCard({ game }) {
  const slug = game.slug || game._id;
  return (
    <Link to={`/games/${slug}`} className="game-card">
      <div className="game-card-image">
        <img src={game.coverImage} alt={game.name} />
        <div className="game-card-overlay">
          <span className="game-rating">★ {game.rating?.average?.toFixed(1) || '-'}</span>
          {game.trending && <span className="game-badge trending">Trending</span>}
          {game.isUpcoming && <span className="game-badge upcoming">Coming Soon</span>}
        </div>
      </div>
      <div className="game-card-info">
        <h3>{game.name}</h3>
        <span className="game-category">{game.category}</span>
        {!game.isUpcoming && game.rating?.count > 0 && (
          <span className="game-reviews">{game.rating.count} reviews</span>
        )}
        {game.isUpcoming && (
          <span className="game-date">Releases {new Date(game.releaseDate).toLocaleDateString()}</span>
        )}
      </div>
    </Link>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ReportModal from '../components/ReportModal';
import './GameDetails.css';

export default function GameDetails() {
  const { slug } = useParams();
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });
  const [communityForm, setCommunityForm] = useState({ title: '', content: '' });
  const [reportModal, setReportModal] = useState({ open: false, type: null, refId: null });

  useEffect(() => {
    api.get(`/games/${slug}`)
      .then(res => {
        setGame(res.data);
        return Promise.all([
          api.get(`/games/${res.data._id}/reviews`),
          api.get(`/games/${res.data._id}/community`),
          api.get(`/news?limit=5`)
        ]);
      })
      .then(([reviewsRes, communityRes, newsRes]) => {
        setReviews(reviewsRes.data);
        setCommunityPosts(communityRes.data);
        setNews(newsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (user?.bookmarks && game) {
      const ids = user.bookmarks.map(b => b._id || b);
      setBookmarked(ids.includes(game._id));
    }
  }, [user, game]);

  const toggleBookmark = async () => {
    if (!user) return;
    try {
      await api.post(`/users/bookmarks/${game._id}`);
      setBookmarked(!bookmarked);
      refreshUser?.();
      addToast(bookmarked ? 'Retiré des favoris' : 'Ajouté aux favoris', 'success');
    } catch (e) {
      console.error(e);
      addToast('Erreur lors de la mise à jour des favoris', 'error');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const { data } = await api.post(`/games/${game._id}/reviews`, reviewForm);
      setReviews([data, ...reviews]);
      const gameRes = await api.get(`/games/${game._id}`);
      setGame(gameRes.data);
      setReviewForm({ rating: 5, title: '', content: '' });
      addToast('Avis publié avec succès', 'success');
    } catch (e) {
      console.error(e);
      addToast('Erreur lors de la publication de l\'avis', 'error');
    }
  };

  const submitCommunityPost = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const { data } = await api.post(`/games/${game._id}/community`, communityForm);
      setCommunityPosts([data, ...communityPosts]);
      setCommunityForm({ title: '', content: '' });
      addToast('Sujet publié avec succès', 'success');
    } catch (e) {
      console.error(e);
      addToast('Erreur lors de la publication du sujet', 'error');
    }
  };

  const handleReportSubmit = async (payload) => {
    try {
      await api.post('/reports', payload);
      addToast('Signalement envoyé', 'success');
      setReportModal({ open: false, type: null, refId: null });
    } catch (e) {
      addToast('Erreur lors du signalement', 'error');
    }
  };

  if (loading || !game) return <div className="page-loading">Loading...</div>;

  return (
    <div className="game-details">
      <div className="game-hero">
        <div className="game-hero-bg" style={{ backgroundImage: `url(${game.coverImage})` }}></div>
        <div className="game-hero-content">
          <div className="game-hero-info">
            <h1>{game.name}</h1>
            <div className="game-meta">
              <span className="category">{game.category}</span>
              <span>{game.platforms?.join(' • ')}</span>
              <span>Released {new Date(game.releaseDate).toLocaleDateString()}</span>
            </div>
            <div className="game-rating-large">
              <span className="stars">★</span> {game.rating?.average?.toFixed(1) || '-'}
              <span className="count">({game.rating?.count || 0} reviews)</span>
            </div>
            {user && (
              <button
                className={`btn-bookmark ${bookmarked ? 'active' : ''}`}
                onClick={toggleBookmark}
              >
                {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="game-body">
        <div className="game-main">
          <section>
            <h2>About</h2>
            <p>{game.description}</p>
          </section>

          {((game.trailerUrls && game.trailerUrls.length > 0) || game.trailerUrl) && (
            <section>
              <h2>Trailers</h2>
              <div className="trailers-list">
                {(game.trailerUrls && game.trailerUrls.length > 0 ? game.trailerUrls : [game.trailerUrl]).map((url, i) => (
                  <div key={i} className="trailer-container">
                    {(game.trailerUrls?.length > 1) && <h3 className="trailer-label">Trailer {i + 1}</h3>}
                    <iframe
                      src={url}
                      title={`Trailer ${i + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {game.screenshots?.length > 0 && (
            <section>
              <h2>Screenshots</h2>
              <div className="screenshots-grid">
                {game.screenshots.map((url, i) => (
                  <img key={i} src={url} alt={`Screenshot ${i + 1}`} />
                ))}
              </div>
            </section>
          )}

          <section className="community-section">
            <h2>Communauté</h2>
            <p className="section-desc">Discutez avec les autres joueurs de {game.name}.</p>
            {user ? (
              <form className="community-form" onSubmit={submitCommunityPost}>
                <input
                  placeholder="Titre du sujet"
                  value={communityForm.title}
                  onChange={e => setCommunityForm(f => ({ ...f, title: e.target.value }))}
                  maxLength={150}
                  required
                />
                <textarea
                  placeholder="Partagez vos astuces, questions ou discussions..."
                  value={communityForm.content}
                  onChange={e => setCommunityForm(f => ({ ...f, content: e.target.value }))}
                  maxLength={2000}
                  required
                />
                <button type="submit">Publier</button>
              </form>
            ) : (
              <p className="login-prompt"><Link to="/login">Connectez-vous</Link> pour participer à la communauté.</p>
            )}
            <div className="community-posts">
              {communityPosts.length === 0 ? (
                <p className="community-empty">Aucun sujet pour le moment. Soyez le premier à lancer la discussion !</p>
              ) : (
                communityPosts.map(post => (
                  <article key={post._id} className="community-post">
                    <div className="community-post-header">
                      <span className="community-post-author">{post.user?.username}</span>
                      <time className="community-post-date">{new Date(post.createdAt).toLocaleDateString()}</time>
                      {user && (
                        <button
                          type="button"
                          className="report-btn"
                          onClick={() => setReportModal({ open: true, type: 'communityPost', refId: post._id })}
                        >
                          Signaler
                        </button>
                      )}
                    </div>
                    <h3 className="community-post-title">{post.title}</h3>
                    <p className="community-post-content">{post.content}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section>
            <h2>Reviews</h2>
            {user ? (
              <form className="review-form" onSubmit={submitReview}>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={reviewForm.rating >= n ? 'active' : ''}
                      onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <input
                  placeholder="Review title"
                  value={reviewForm.title}
                  onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                />
                <textarea
                  placeholder="Write your review..."
                  value={reviewForm.content}
                  onChange={e => setReviewForm(f => ({ ...f, content: e.target.value }))}
                  required
                />
                <button type="submit">Submit Review</button>
              </form>
            ) : (
              <p className="login-prompt"><Link to="/login">Login</Link> to write a review.</p>
            )}
            <div className="reviews-list">
              {reviews.map(r => (
                <div key={r._id} className="review-card">
                  <div className="review-header">
                    <span className="review-user">{r.user?.username}</span>
                    <span className="review-rating">★ {r.rating}</span>
                    {user && (
                      <button
                        type="button"
                        className="report-btn"
                        onClick={() => setReportModal({ open: true, type: 'review', refId: r._id })}
                      >
                        Signaler
                      </button>
                    )}
                  </div>
                  {r.title && <h4>{r.title}</h4>}
                  <p>{r.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="game-sidebar">
          {game.recentUpdate && (
            <div className="sidebar-block">
              <h3>Latest Update</h3>
              <p>{game.recentUpdate}</p>
            </div>
          )}
          <div className="sidebar-block">
            <h3>Related News</h3>
            {news.slice(0, 3).map(n => (
              <Link key={n._id} to="/news" className="news-link">
                {n.title}
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <ReportModal
        isOpen={reportModal.open}
        onClose={() => setReportModal({ open: false, type: null, refId: null })}
        onSubmit={handleReportSubmit}
        type={reportModal.type}
        refId={reportModal.refId}
      />
    </div>
  );
}

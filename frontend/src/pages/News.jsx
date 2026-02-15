import { useState, useEffect } from 'react';
import api from '../api';
import './News.css';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news')
      .then(res => setNews(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="news-page">
      <div className="page-header">
        <h1>Gaming News</h1>
        <p>Latest updates from the gaming world</p>
      </div>
      <div className="news-list">
        {news.map(item => (
          <article key={item._id} className="news-article">
            <div className="news-article-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="news-article-content">
              <span className="news-tag">{item.category}</span>
              <h2>{item.title}</h2>
              <p>{item.excerpt || item.content?.slice(0, 200)}</p>
              <time>{new Date(item.createdAt).toLocaleDateString()}</time>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

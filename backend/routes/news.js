const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Get all news (API ready for real-time gaming news)
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 20 } = req.query;
    let query = {};
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const news = await News.find(query)
      .populate('relatedGame', 'name slug coverImage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single news
router.get('/:slug', async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug })
      .populate('relatedGame', 'name slug coverImage');
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

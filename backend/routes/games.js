const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Game = require('../models/Game');
const Review = require('../models/Review');
const CommunityPost = require('../models/CommunityPost');
const { protect } = require('../middleware/auth');

// Get all games (with filters)
router.get('/', async (req, res) => {
  try {
    const { search, category, platform, sort = '-createdAt', upcoming } = req.query;
    let query = {};

    if (upcoming === 'true') {
      query.isUpcoming = true;
    } else if (upcoming === 'false') {
      query.isUpcoming = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (platform) query.platforms = platform;

    const games = await Game.find(query)
      .sort(sort)
      .limit(parseInt(req.query.limit) || 50);

    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trending/featured games
router.get('/trending', async (req, res) => {
  try {
    const games = await Game.find({ trending: true, isUpcoming: false })
      .sort({ 'rating.average': -1 })
      .limit(10);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming games
router.get('/upcoming', async (req, res) => {
  try {
    const games = await Game.find({ isUpcoming: true })
      .sort({ releaseDate: 1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get game reviews (must be before /:identifier to avoid conflict)
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ game: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get community posts for a game
router.get('/:id/community', async (req, res) => {
  try {
    const posts = await CommunityPost.find({ game: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create community post (protected)
router.post('/:id/community', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const post = await CommunityPost.create({
      game: req.params.id,
      user: req.user.id,
      title: title.trim(),
      content: content.trim()
    });
    const populated = await CommunityPost.findById(post._id).populate('user', 'username');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single game by slug or id
router.get('/:identifier', async (req, res) => {
  try {
    const game = mongoose.Types.ObjectId.isValid(req.params.identifier) && req.params.identifier.length === 24
      ? await Game.findOne({ $or: [{ _id: req.params.identifier }, { slug: req.params.identifier }] })
      : await Game.findOne({ slug: req.params.identifier });

    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add/update review (protected)
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, title, content } = req.body;
    const review = await Review.findOneAndUpdate(
      { game: req.params.id, user: req.user.id },
      { rating, title, content },
      { new: true, upsert: true }
    ).populate('user', 'username');

    // Update game rating
    const reviews = await Review.find({ game: req.params.id });
    const avgRating = reviews.length > 0
      ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      : 0;
    await Game.findByIdAndUpdate(req.params.id, {
      'rating.average': Math.round(avgRating * 10) / 10,
      'rating.count': reviews.length
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

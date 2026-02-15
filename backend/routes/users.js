const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const path = require('path');
const multer = require('multer');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
});

// Upload avatar
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user profile (full)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('bookmarks', 'name coverImage slug rating')
      .select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile (username, email, avatar, notification preferences)
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, email, avatar, notifyNewReleases, notifyUpdates } = req.body;
    const update = {};
    if (username !== undefined) update.username = username.trim();
    if (email !== undefined) update.email = email.toLowerCase().trim();
    if (avatar !== undefined) update.avatar = avatar.trim() || null;
    if (notifyNewReleases !== undefined) update.notifyNewReleases = notifyNewReleases;
    if (notifyUpdates !== undefined) update.notifyUpdates = notifyUpdates;

    if (username && (await User.findOne({ username: update.username, _id: { $ne: req.user.id } }))) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    if (email && (await User.findOne({ email: update.email, _id: { $ne: req.user.id } }))) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true })
      .select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    const user = await User.findById(req.user.id).select('+password');
    const valid = await user.comparePassword(currentPassword);
    if (!valid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user bookmarks
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('bookmarks', 'name coverImage slug rating category releaseDate');
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle bookmark
router.post('/bookmarks/:gameId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const index = user.bookmarks.indexOf(req.params.gameId);

    if (index > -1) {
      user.bookmarks.splice(index, 1);
    } else {
      user.bookmarks.push(req.params.gameId);
    }
    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .populate('bookmarks', 'name coverImage slug rating');
    res.json(updatedUser.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notifications
router.get('/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('relatedGame', 'name slug')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update notification preferences
router.patch('/preferences', protect, async (req, res) => {
  try {
    const { notifyNewReleases, notifyUpdates } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { notifyNewReleases, notifyUpdates },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

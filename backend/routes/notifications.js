const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// Create notification for new release (admin only - can be called when adding game)
router.post('/broadcast', protect, admin, async (req, res) => {
  try {
    const { title, message, type, relatedGame } = req.body;
    const users = await User.find(
      type === 'new_release' ? { notifyNewReleases: true } : { notifyUpdates: true }
    );
    const notifications = await Notification.insertMany(
      users.map(u => ({ user: u._id, title, message, type, relatedGame }))
    );
    res.json({ created: notifications.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

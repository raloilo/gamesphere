const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');

// Create report (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { type, refId, reason, comment } = req.body;
    if (!type || !refId || !reason) {
      return res.status(400).json({ message: 'Type, refId and reason are required' });
    }
    if (!['review', 'communityPost'].includes(type)) {
      return res.status(400).json({ message: 'Invalid report type' });
    }
    if (!['spam', 'harassment', 'inappropriate', 'off_topic', 'other'].includes(reason)) {
      return res.status(400).json({ message: 'Invalid reason' });
    }
    const report = await Report.create({
      reporter: req.user.id,
      type,
      refId,
      reason,
      comment: comment || undefined
    });
    res.status(201).json({ _id: report._id, message: 'Report submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

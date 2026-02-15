const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  }
}, { timestamps: true });

communityPostSchema.index({ game: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);

const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
  },
  category: {
    type: String,
    enum: ['News', 'Review', 'Update', 'Release', 'Industry'],
    default: 'News'
  },
  source: {
    type: String,
    default: 'GameSphere'
  },
  relatedGame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

newsSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

newsSchema.index({ createdAt: -1 });

module.exports = mongoose.model('News', newsSchema);

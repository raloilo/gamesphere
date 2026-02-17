const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  developer: {
    type: String,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Action', 'Adventure', 'RPG', 'Sports', 'Racing', 'Shooter', 'Strategy', 'Simulation', 'Horror', 'Indie', 'Other'],
    required: true
  },
  platforms: [{
    type: String,
    enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile']
  }],
  releaseDate: {
    type: Date,
    required: true
  },
  isUpcoming: {
    type: Boolean,
    default: false
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400'
  },
  screenshots: [{
    type: String
  }],
  trailerUrl: {
    type: String
  },
  trailerUrl2: {
    type: String
  },
  trailerUrls: [{
    type: String
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  trending: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  recentUpdate: {
    type: String,
    default: null
  },
  updateDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

gameSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

gameSchema.index({ name: 'text', description: 'text' });
gameSchema.index({ category: 1 });
gameSchema.index({ releaseDate: -1 });
gameSchema.index({ trending: 1, rating: -1 });

module.exports = mongoose.model('Game', gameSchema);

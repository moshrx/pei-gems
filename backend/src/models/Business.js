const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['restaurant', 'retail', 'tourism', 'service', 'food-producer', 'other'],
    required: true,
  },
  location: {
    type: String, // "Charlottetown", "Summerside", etc.
    required: true,
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  phone: String,
  email: String,
  website: String,
  description: String,
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String,
  },
  photos: {
    type: [String], // Cloudinary URLs
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googlePlaceId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update avgRating when reviews are added
businessSchema.methods.updateRating = async function () {
  const Review = require('./Review');
  const reviews = await Review.find({ businessId: this._id });
  if (reviews.length === 0) {
    this.avgRating = 0;
    this.reviewCount = 0;
  } else {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    this.avgRating = Math.round((sum / reviews.length) * 10) / 10;
    this.reviewCount = reviews.length;
  }
  await this.save();
};

module.exports = mongoose.model('Business', businessSchema);

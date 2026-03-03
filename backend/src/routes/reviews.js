const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Business = require('../models/Business');

// GET reviews for a business
router.get('/business/:businessId', async (req, res) => {
  try {
    const reviews = await Review.find({ businessId: req.params.businessId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new review
router.post('/', async (req, res) => {
  try {
    const { businessId, author, email, rating, text } = req.body;

    if (!businessId || !author || !email || !rating || !text) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const review = new Review({
      businessId,
      author,
      email,
      rating: parseInt(rating),
      text,
    });

    await review.save();

    // Update business rating
    const business = await Business.findById(businessId);
    if (business) {
      await business.updateRating();
    }

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

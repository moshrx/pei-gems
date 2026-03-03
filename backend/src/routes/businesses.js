const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

// GET all businesses with filters
router.get('/', async (req, res) => {
  try {
    const { category, location, search, minRating } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minRating) filter.avgRating = { $gte: parseInt(minRating) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const businesses = await Business.find(filter)
      .sort({ avgRating: -1, createdAt: -1 })
      .limit(50);

    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single business by ID
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new business
router.post('/', async (req, res) => {
  try {
    const { name, category, location, phone, email, website, description } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({ error: 'Name, category, and location are required' });
    }

    const business = new Business({
      name,
      category,
      location,
      phone,
      email,
      website,
      description,
    });

    await business.save();
    res.status(201).json(business);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update business
router.put('/:id', async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json(business);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

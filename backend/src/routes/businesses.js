const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const auth = require('../middleware/auth');

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

// GET current owner's business (protected)
router.get('/owner/me', auth, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(404).json({ error: 'No business found for this account.' });
    }
    res.json(business);
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

// PUT update business (protected - owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    if (!business.owner || business.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own business.' });
    }

    const allowed = ['name', 'phone', 'email', 'website', 'description', 'hours', 'category', 'location'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) business[field] = req.body[field];
    });
    business.updatedAt = Date.now();

    await business.save();
    res.json(business);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

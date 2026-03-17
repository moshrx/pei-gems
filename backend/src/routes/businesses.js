const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const Review = require('../models/Review');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Helper: HTTPS GET returning parsed JSON
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    require('https').get(url, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

const MAX_PHOTOS = 10;

async function getOwnedBusinessOrForbidden(req, res) {
  const business = await Business.findById(req.params.id);
  if (!business) {
    res.status(404).json({ error: 'Business not found' });
    return null;
  }

  if (!business.owner || business.owner.toString() !== req.user._id.toString()) {
    res.status(403).json({ error: 'You can only manage photos for your own business.' });
    return null;
  }

  return business;
}

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
      .sort({ planWeight: -1, avgRating: -1, createdAt: -1 })
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

// POST new business (public - no owner)
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

// POST create business for current owner (protected)
router.post('/mine', auth, async (req, res) => {
  try {
    // Check if user already has a business
    const existing = await Business.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ error: 'You already have a business linked to your account.' });
    }

    const { name, category, location, phone, email, website, description, hours } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({ error: 'Name, category, and location are required.' });
    }

    const business = await Business.create({
      name,
      category,
      location,
      phone,
      email,
      website,
      description,
      hours,
      owner: req.user._id,
    });

    // Link business to user
    await User.findByIdAndUpdate(req.user._id, { businessId: business._id });

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

// POST add business photo (protected - owner only)
router.post('/:id/photos', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ error: 'imageUrl is required.' });
    }

    // Basic validation: must be a Cloudinary URL
    if (!imageUrl.includes('cloudinary.com') || !imageUrl.includes('/upload/')) {
      return res.status(400).json({ error: 'Invalid Cloudinary image URL.' });
    }

    const business = await getOwnedBusinessOrForbidden(req, res);
    if (!business) return;

    const owner = await User.findById(req.user._id).select('subscription');
    const plan = owner?.subscription?.plan || 'free';
    const photoLimit = plan === 'free' ? 3 : MAX_PHOTOS;

    if (business.photos.length >= photoLimit) {
      const limitMsg = plan === 'free'
        ? `Free plan allows up to 3 photos. Upgrade to upload more.`
        : `Maximum ${MAX_PHOTOS} photos allowed per business.`;
      return res.status(400).json({ error: limitMsg });
    }

    if (business.photos.includes(imageUrl)) {
      return res.status(400).json({ error: 'Photo already exists in this business gallery.' });
    }

    business.photos.push(imageUrl);
    business.updatedAt = Date.now();
    await business.save();

    return res.json(business);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE business photo by index (protected - owner only)
router.delete('/:id/photos/:photoId', auth, async (req, res) => {
  try {
    const business = await getOwnedBusinessOrForbidden(req, res);
    if (!business) return;

    const photoIndex = Number.parseInt(req.params.photoId, 10);
    if (Number.isNaN(photoIndex) || photoIndex < 0 || photoIndex >= business.photos.length) {
      return res.status(400).json({ error: 'Invalid photoId.' });
    }

    business.photos.splice(photoIndex, 1);
    business.updatedAt = Date.now();
    await business.save();
    return res.json(business);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// PUT reorder business photos (protected - owner only)
router.put('/:id/photos/reorder', auth, async (req, res) => {
  try {
    const { photos } = req.body;
    if (!Array.isArray(photos)) {
      return res.status(400).json({ error: 'photos array is required.' });
    }

    const business = await getOwnedBusinessOrForbidden(req, res);
    if (!business) return;

    if (photos.length > MAX_PHOTOS) {
      return res.status(400).json({ error: `Maximum ${MAX_PHOTOS} photos allowed per business.` });
    }

    if (photos.length !== business.photos.length) {
      return res.status(400).json({ error: 'Reordered photos must include all existing photos.' });
    }

    const currentSet = new Set(business.photos);
    const nextSet = new Set(photos);

    if (currentSet.size !== nextSet.size || [...nextSet].some((url) => !currentSet.has(url))) {
      return res.status(400).json({ error: 'Reordered photos do not match current photo set.' });
    }

    business.photos = photos;
    business.updatedAt = Date.now();
    await business.save();
    return res.json(business);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// POST import reviews from Google Places (protected - owner only)
router.post('/:id/import-reviews', auth, async (req, res) => {
  try {
    const business = await getOwnedBusinessOrForbidden(req, res);
    if (!business) return;

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Google Places API key not configured.' });
    }

    // Step 1: Look up Place ID if we don't have it yet
    if (!business.googlePlaceId) {
      const query = encodeURIComponent(`${business.name} ${business.location} Prince Edward Island`);
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;
      const searchResult = await httpsGet(searchUrl);

      if (!searchResult.results || searchResult.results.length === 0) {
        return res.status(404).json({ error: 'Could not find this business on Google Maps. Try adding a Google Place ID manually.' });
      }

      business.googlePlaceId = searchResult.results[0].place_id;
      await business.save();
    }

    // Step 2: Fetch reviews from Place Details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${business.googlePlaceId}&fields=reviews&key=${apiKey}`;
    const detailsResult = await httpsGet(detailsUrl);

    const googleReviews = detailsResult.result?.reviews || [];

    // Step 3: Import up to 5 reviews, deduplicating
    let imported = 0;
    for (const gr of googleReviews.slice(0, 5)) {
      const exists = await Review.findOne({
        businessId: business._id,
        source: 'google',
        author: gr.author_name,
        rating: gr.rating,
      });

      if (!exists) {
        await Review.create({
          businessId: business._id,
          author: gr.author_name,
          email: 'noreply@google.com',
          rating: gr.rating,
          text: gr.text || '(No review text)',
          source: 'google',
          googleAuthorPhotoUrl: gr.profile_photo_url || null,
          createdAt: gr.time ? new Date(gr.time * 1000) : new Date(),
        });
        imported++;
      }
    }

    // Step 4: Recalculate rating if any were imported
    if (imported > 0) {
      await business.updateRating();
    }

    res.json({ imported, total: googleReviews.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

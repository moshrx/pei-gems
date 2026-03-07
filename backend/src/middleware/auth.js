const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Authorization denied.' });
    }

    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found. Authorization denied.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token. Authorization denied.' });
  }
};

module.exports = auth;

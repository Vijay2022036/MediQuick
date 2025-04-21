const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Pharmacy = require('./models/Pharmacy');

const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('Not authorized , please login');
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = null;

    switch (decoded.role) {
      case 'admin':
        user = await Admin.findById(decoded.id);
        break;
      case 'pharmacy':
        user = await Pharmacy.findById(decoded.id);
        break;
      case 'customer':
        user = await User.findById(decoded.id);
        break;
      default:
        return res.status(401).json({ error: 'Invalid role in token' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    req.user = user;
    req.user.role = decoded.role;
    next();
  } catch (error) {
    console.log('Authorization error:', error.message);
    return res.status(401).json({ error: 'Not authorized' });
  }
};

const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admin only' });
  }
  next();
};

const pharmacy = (req, res, next) => {
  if (req.user.role !== 'pharmacy') {
    return res.status(403).json({ error: 'Access denied: Pharmacy only' });
  }
  if (!req.user.verified) {
    return res.status(403).json({ error: 'Access denied: Pharmacy not verified' });
  }
  next();
};

const customer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Access denied: Customer only' });
  }
  next();
};

module.exports = { protect, admin, pharmacy, customer };

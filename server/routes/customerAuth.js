const express = require('express');
const router = express.Router();
const auth = require('../middleware');
const User = require('../models/User');
const { registerCustomer, loginCustomer } = require('../controllers/customerAuthController');
const { route } = require('./cartRoute');

router.post('/register', async (req, res, next) => {
    try {
        await registerCustomer(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        await loginCustomer(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/', auth.protect, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
);
// DELETE user
router.delete('/:id', auth.protect, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// GET profile
router.get('/profile', auth.protect , async (req, res) => {
  try {
    res.json(req.user); // Already fetched in auth middleware
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT profile
router.put('/profile', auth.protect,  async (req, res) => {
  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
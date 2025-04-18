// ✅ Updated cartRoute.js
const express = require('express');
const cartRouter = express.Router();
const { addToCart, getUserCart, updateCartItemQuantity, removeFromCart, checkout } = require('../controllers/cartController.js');
const auth = require('../middleware');

cartRouter.get('/', auth.protect, getUserCart);
cartRouter.post('/add', auth.protect, addToCart);
cartRouter.put('/update', auth.protect, updateCartItemQuantity);
cartRouter.delete('/:itemId', auth.protect, removeFromCart);
cartRouter.post('/checkout', auth.protect, checkout);

module.exports = cartRouter;

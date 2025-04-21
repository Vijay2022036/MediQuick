// ✅ Updated cartRoute.js
const express = require('express');
const cartRouter = express.Router();
const { addToCart, getUserCart, updateCartItemQuantity, removeFromCart } = require('../controllers/cartController.js');
const {protect , customer} = require('../middleware');

cartRouter.get('/', protect, customer , getUserCart);
cartRouter.post('/add', protect, customer , addToCart);
cartRouter.put('/update', protect, customer , updateCartItemQuantity);
cartRouter.delete('/:itemId', protect , customer , removeFromCart);

module.exports = cartRouter;

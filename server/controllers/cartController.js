// ✅ New cartController.js
import User from '../models/User.js';
import Medicine from '../models/Medicine.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const addToCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    const index = user.cartData.findIndex(item => item.medicine.toString() === itemId);

    if (index > -1) {
      user.cartData[index].quantity += quantity || 1;
    } else {
      user.cartData.push({ medicine: itemId, quantity: quantity || 1 });
    }

    await user.save();
    res.json({ success: true, message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cartData.medicine');
    const formattedCart = user.cartData.map(item => ({
      _id: item.medicine._id,
      name: item.medicine.name,
      image: item.medicine.image,
      price: item.medicine.price,
      quantity: item.quantity
    }));
    res.json({ success: true, cartData: formattedCart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    const index = user.cartData.findIndex(item => item.medicine.toString() === itemId);

    if (index > -1) {
      user.cartData[index].quantity = Math.max(1, quantity);
      await user.save();
      res.json({ success: true, message: 'Quantity updated' });
    } else {
      res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);
    user.cartData = user.cartData.filter(item => item.medicine.toString() !== itemId);
    await user.save();
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const checkout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cartData.medicine');
    const cartItems = user.cartData;
    console.log(user);
    const totalAmount = cartItems.reduce((acc, item) => acc + item.medicine.price * item.quantity, 0);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: totalAmount * 100, // in paise
      currency: 'INR',
      receipt: `order_rcptid_${user._id}`
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { addToCart, getUserCart, updateCartItemQuantity, removeFromCart, checkout };
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Medicine = require('../models/Medicine');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cartData.medicine');
    const cartItems = user.cartData;

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.medicine.price * item.quantity,
      0
    );

    const options = {
      amount: totalAmount * 100, // in paise
      currency: 'INR',
      receipt: `order_rcptid_${user._id}`
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature, payment verification failed' });
    }

    const user = await User.findById(req.user._id).populate('cartData.medicine');
    const cartItems = user.cartData;

    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.medicine.price * item.quantity,
      0
    );

    for (let item of cartItems) {
      const medicine = await Medicine.findById(item.medicine._id);
      if (!medicine) continue;
      medicine.stockQuantity = Math.max(0, medicine.stockQuantity - item.quantity);
      await medicine.save();
    }

    const newOrder = {
      items: cartItems.map(item => ({
        medicine: item.medicine._id,
        quantity: item.quantity
      })),
      totalAmount,
      paymentStatus: 'paid'
    };

    user.orders.push(newOrder);
    user.cartData = [];
    await user.save();

    res.status(200).json({ success: true, message: 'Payment verified and order placed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, verifyPayment };

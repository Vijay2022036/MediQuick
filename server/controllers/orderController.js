
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const Razorpay = require('razorpay');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email') // optional: show customer details
      .populate('items.medicine', 'name price image') // optional: show medicine details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email') // optional: show customer details
      .populate('items.medicine', 'name price image') // optional: show medicine details
      .sort({ createdAt: -1 });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('customer', 'name email') // optional: show customer details
      .populate('items.medicine', 'name price') // optional: show medicine details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('customer', 'name email') // optional: show customer details
      .populate('items.medicine', 'name price image'); // optional: show medicine details
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  // deleteOrder,
  // addOrder,
};
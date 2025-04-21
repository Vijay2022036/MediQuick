require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const mongoose = require('mongoose');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    if (
      !deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.addressLine1 || 
      !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode || 
      !deliveryAddress.phone
    ) {
      return res.status(400).json({ 
        success: false, 
        message: 'Complete delivery address information is required' 
      });
    }

    const user = await User.findById(req.user._id).populate('cartData.medicine');
    const cartItems = user.cartData;

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Check if requested quantity exceeds stock
    for (const item of cartItems) {
      if (!item.medicine) {
        return res.status(400).json({ 
          success: false, 
          message: `Some medicines in cart are no longer available.` 
        });
      }

      if (item.quantity > item.medicine.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity for "${item.medicine.name}" exceeds available stock (${item.medicine.stockQuantity})`
        });
      }
    }

    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.medicine.price * item.quantity,
      0
    );

    if (totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid total amount' });
    }

    user.tempDeliveryAddress = deliveryAddress;
    await user.save();

    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `order_rcptid_${user._id}`,
      notes: {
        customerName: deliveryAddress.fullName,
        customerPhone: deliveryAddress.phone,
        shippingAddress: `${deliveryAddress.addressLine1}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.zipCode}`
      }
    };

    console.log("Creating Razorpay Order with:", options);

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Razorpay Order Creation Error:", err);
        return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
      }
      res.status(200).json({ success: true, order });
    });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong while creating order" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      deliveryAddress 
    } = req.body;

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

    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.medicine.price * item.quantity,
      0
    );

    // Update medicine stock quantities
    for (let item of cartItems) {
      const medicine = await Medicine.findById(item.medicine._id);
      if (!medicine) continue;
      medicine.stockQuantity = Math.max(0, medicine.stockQuantity - item.quantity);
      await medicine.save();
    }
    console.log("Updated stock quantities for medicines in cart");
    
    const finalDeliveryAddress = deliveryAddress;    
    const newOrder = new Order({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      customer: req.user._id,
      items: cartItems.map(item => ({
        medicine: item.medicine._id,
        quantity: item.quantity,
        price: item.medicine.price
      })),
      status: 'confirmed',
      totalPrice,
      paymentStatus: 'completed',
      deliveryAddress: {
        fullName: finalDeliveryAddress.fullName,
        addressLine1: finalDeliveryAddress.addressLine1,
        addressLine2: finalDeliveryAddress.addressLine2 || '',
        city: finalDeliveryAddress.city,
        state: finalDeliveryAddress.state,
        zipCode: finalDeliveryAddress.zipCode,
        phone: finalDeliveryAddress.phone
      },
      deliveryStatus: 'processing'
    });
    
    console.log("New order created with delivery address:", newOrder);
    await newOrder.save();
    // Update user document
    user.orders.push(newOrder._id);
    user.cartData = [];    
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Payment verified and order placed',
      orderId: newOrder._id 
    });
    
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, verifyPayment };
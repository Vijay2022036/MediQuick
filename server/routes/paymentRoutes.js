const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const middleware = require('./../middleware');

const paymentRouter = express.Router();

paymentRouter.route('/create-order').post(middleware.protect, async (req, res, next) => {
    try {
        const { amount } = req.body;
        const order = await createOrder(amount);
        res.json(order);
    } catch (err) {
        next(err);
    }
});

paymentRouter.route('/verify').post(middleware.protect, async (req, res, next) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;
        const isValid = await verifyPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature);
        if (isValid) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = paymentRouter;
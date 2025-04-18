const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const middleware = require('./../middleware');

const paymentRouter = express.Router();

paymentRouter.route('/create-order').post(middleware.protect, createOrder);
paymentRouter.route('/verify').post(middleware.protect, verifyPayment);  

module.exports = paymentRouter;
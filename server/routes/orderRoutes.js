const express = require('express');
const orderRouter = express.Router();
const { protect, pharmacy } = require('./../middleware');
const { 
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  assignDeliveryAgent,
} = require('../controllers/orderController');

// Get all orders
orderRouter.get('/', protect, async (req, res, next) => {
  try {
    await getAllOrders(req, res);
  } catch (err) {
    next(err);
  }
});

// Get order by ID
orderRouter.get('/:id', protect, async (req, res, next) => {
  try {
    await getOrderById(req, res);
  } catch (err) {
    next(err);
  }
});

// Create a new order
orderRouter.post('/', protect, async (req, res, next) => {
  try {
    await createOrder(req, res);
  } catch (err) {
    next(err);
  }
});

// Update an existing order
orderRouter.put('/:id', protect, async (req, res, next) => {
  try {
    await updateOrder(req, res);
  } catch (err) {
    next(err);
  }
});

// Update order status
orderRouter.put('/:id/status', protect, pharmacy, async (req, res, next) => {
  try {
    await updateOrderStatus(req, res);
  } catch (err) {
    next(err);
  }
});

// Assign delivery agent to order
orderRouter.put('/:id/assign', protect, pharmacy, async (req, res, next) => {
  try {
    await assignDeliveryAgent(req, res);
  } catch (err) {
    next(err);
  }
});

// Delete an order
orderRouter.delete('/:id', protect, async (req, res, next) => {
  try {
    await deleteOrder(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = orderRouter;
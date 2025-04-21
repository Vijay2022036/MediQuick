const express = require('express');
const orderRouter = express.Router();
const { protect, admin} = require('./../middleware');
const { 
  getAllOrders,
  getUserOrders,
  getOrderById,
  // deleteOrder,
  updateOrderStatus,
} = require('../controllers/orderController');

// Get all orders
orderRouter.get('/', protect, async (req, res, next) => {
  try {
    await getAllOrders(req, res);
  } catch (err) {
    next(err);
  }
});


orderRouter.get('/user', protect, async (req, res, next) => {
  try {
    await getUserOrders(req, res);
  } catch (err) {
    next(err);
  }
});

orderRouter.get('/:id', protect, async (req, res, next) => {
  try {
    await getOrderById(req, res);
  } catch (err) {
    next(err);
  }
});


orderRouter.put('/status/:id', protect , admin ,async (req, res, next) => {
  try {
    await updateOrderStatus(req, res);
  } catch (err) {
    next(err);
  }
});


// Delete an order
// orderRouter.delete('/:id', protect, async (req, res, next) => {
//   try {
//     await deleteOrder(req, res);
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = orderRouter;
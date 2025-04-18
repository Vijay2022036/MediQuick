const Order = require('../models/Order');
const Medicine = require('../models/Medicine');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createOrder = async (req, res) => {
  try {
    const { customer, pharmacy, items } = req.body;

    // Check if there's enough stock for each item
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(404).json({ message: `Medicine with ID ${item.medicineId} not found` });
      }
      if (medicine.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for medicine ${medicine.name}` });
      }
    }

    // Create the order
    const order = new Order({ customer, pharmacy, items });
    const savedOrder = await order.save();

    // Reduce stock quantity for each medicine
    for (const item of items) {
      await Medicine.findByIdAndUpdate(
        item.medicineId,
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle validation errors (e.g., required fields missing)
      return res.status(400).json({ message: error.message });
    } else {
      // Handle other errors (e.g., database errors)
      return res.status(500).json({ message: error.message });
    }
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const validStatusTransitions = {
      'Pending': ['Accepted', 'Cancelled'],
      'Accepted': ['Packed', 'Cancelled'],
      'Packed': ['Ready for Pickup'],
      'Ready for Pickup': ['Out for Delivery'],
      'Out for Delivery': ['Delivered'],
    };

    if (status !== order.status && (!validStatusTransitions[order.status] || !validStatusTransitions[order.status].includes(status))) {
      return res.status(400).json({ message: `Invalid status transition from ${order.status} to ${status}` });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const assignDeliveryAgent = async (req, res) => {
  try {
    const { deliveryAgent } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryAgent = deliveryAgent;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  assignDeliveryAgent,
};
const Medicine = require('../models/Medicine');
const User = require('../models/User');

const getAllOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('orders.items.medicine', 'name price');
    res.status(200).json({ orders: user.orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    let totalAmount = 0;
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(404).json({ message: `Medicine with ID ${item.medicineId} not found` });
      }
      if (medicine.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for medicine ${medicine.name}` });
      }

      totalAmount += item.quantity * medicine.price;
    }

    // Update stock
    for (const item of items) {
      await Medicine.findByIdAndUpdate(item.medicineId, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    const order = {
      items: items.map(i => ({
        medicine: i.medicineId,
        quantity: i.quantity,
      })),
      totalAmount,
      createdAt: new Date(),
      paymentStatus: 'Paid', // Assuming successful payment
    };

    req.user.orders.push(order);
    req.user.cartData = []; // Clear cart after order
    await req.user.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
};
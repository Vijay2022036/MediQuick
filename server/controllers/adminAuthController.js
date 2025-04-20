const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Pharmacy = require('../models/Pharmacy');
const User = require('../models/User');
const Admin = require('../models/Admin');

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('correct password');
    const payload = { id: admin._id , role: admin.role };
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({ message: 'JWT secret key not defined' });
    }

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin' // fallback role if missing
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const dashboardStats = async (req, res, next) => {  
  try {
      const totalUsers = await User.countDocuments();
      const totalPharmacies = await Pharmacy.countDocuments();
      const totalOrders = await Order.countDocuments();
      const pendingApprovals = await Pharmacy.countDocuments({ verified: false });

      res.json({
          totalUsers,
          totalPharmacies,
          totalOrders,
          pendingApprovals
      });
  } catch (err) {
      next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
      const admin = await Admin.findById(req.user._id);
      if (!admin) {
          return res.status(404).json({ message: 'Admin not found' });
      }
      res.json(admin);
  } catch (err) {
      next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
      const orderId = req.params.orderId;
      const { status } = req.body;
      const order = await Order.findById(orderId);
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }
      order.status = status;
      await order.save();
      console.log(order);
      res.status(200).json({ message: 'Order status updated successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerAdmin, loginAdmin , dashboardStats , getProfile , updateStatus};

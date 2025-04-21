const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin , dashboardStats , getProfile , updateStatus , generateReport} = require('../controllers/adminAuthController');
const Order = require('../models/Order');
const Pharmacy = require('../models/Pharmacy');
const {protect , admin} = require('../middleware');

router.post('/register',  async (req, res, next) => {
    try {
        await registerAdmin(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try{
        await loginAdmin(req, res);
    } catch (err){
        next(err);
    }
});

router.get('/orders', protect , admin , async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

router.get('/approval', protect , admin , async (req, res, next) => {
    try {
        const pendingApprovals = await Pharmacy.find({ verified: false });
        res.json(pendingApprovals);
    } catch (err) {
        next(err);
    }
});

router.get('/export-report', protect, admin, async (req, res, next) => {
    console.log("Generating report...");
    console.log(req.query.timeRange);
    try {
        const reportData = await generateReport(req, res);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=admin-report.csv');
        res.status(200).send(reportData);
    } catch (error) {
        next(error);
    }
});
router.get('/profile', protect , admin , getProfile);
router.get('/dashboard-stats', protect , admin , dashboardStats );
router.put('/orders/status/:orderId', protect , admin , updateStatus );
module.exports = router;
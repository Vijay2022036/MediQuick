const express = require('express');
const medicineController = require('../controllers/medicineController');
const router = express.Router();
const { protect, customer } = require('./../middleware');
const { pharmacy } = require('./../middleware');
const Medicine = require('../models/Medicine');

router.get('/', async (req, res, next) => {
    try {
        console.log("hello from medicineroute")
        await medicineController.getAllMedicines(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        await medicineController.getMedicineById(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/', protect, pharmacy, async (req, res, next) => {
    try {
        await medicineController.createMedicine(req, res);
    } catch (err) {
        next(err);
    }
});

router.put('/:id',protect, pharmacy, async (req, res, next) => {
    try {
        await medicineController.updateMedicine(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/pharmacy/:pharmacyId', protect, pharmacy, async (req, res, next) => {
    try {
        await medicineController.getPharmacyMedicines(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', protect, pharmacy, async (req, res, next) => {
    try {
        await medicineController.deleteMedicine(req, res);
    } catch (err) {
        next(err);
    }
});

// Add this endpoint to your existing routes
router.post('/stock-info', protect , customer , async (req, res) => {
    try {
      const { medicineIds } = req.body;
      
      // Validate input
      if (!medicineIds || !Array.isArray(medicineIds) || medicineIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request. medicine IDs array is required.'
        });
      }
      
      // Find all medicines by their IDs
      const medicines = await Medicine.find(
        { _id: { $in: medicineIds } },
        { _id: 1, stockQuantity: 1 } // Only return _id and stock fields
      );
      
      // Convert to object with medicine ID as key and stock as value
      const stockInfo = {};
      medicines.forEach(medicine => {
        stockInfo[medicine._id.toString()] = medicine.stockQuantity || 0;
      });
      
      return res.status(200).json({
        success: true,
        stockInfo
      });
    } catch (error) {
      console.error('Error fetching stock info:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching stock information'
      });
    }
  });

module.exports = router;
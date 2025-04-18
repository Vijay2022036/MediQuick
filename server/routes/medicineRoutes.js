const express = require('express');
const medicineController = require('../controllers/medicineController');
const router = express.Router();
const { protect } = require('./../middleware');
const { pharmacy } = require('./../middleware');


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

module.exports = router;
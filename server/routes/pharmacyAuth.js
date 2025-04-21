const express = require('express');
const router = express.Router();
const { registerPharmacy, loginPharmacy, verifyPharmacy } = require('../controllers/pharmacyAuthController');
const Medicine = require('../models/Medicine')
const { protect, pharmacy , admin } = require('./../middleware');
const Pharmacy = require('../models/Pharmacy');
router.post('/register', async (req, res, next) => {
    try {
        await registerPharmacy(req, res);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        await loginPharmacy(req, res);
    } catch (err) {
        next(err);
    }
});

router.put('/verify/:id', protect , admin , async (req, res, next) => {
    try {
        await verifyPharmacy(req, res);
    } catch (err) {
        next(err);
    }
});

// GET all pharmacies
router.get('/', protect , admin , async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find();
        res.json(pharmacies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// DELETE pharmacy
router.delete('/delete/:id', protect , admin , async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);
        if (!pharmacy) {
            return res.status(404).json({ message: 'Pharmacy not found' });
        }
        // Optionally, set the stock of all medicines associated with this pharmacy to 0
        await Medicine.updateMany({ pharmacy: req.params.id }, { $set: { stockQuantity: 0 } });
        res.json({ message: 'Pharmacy deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// GET pharmacy profile
router.get('/medicines' , protect , pharmacy , async (req, res) => {
    try {
      const pharmacyId = req.user._id;
       console.log('Pharmacy ID:', pharmacyId);
      const medicines = await Medicine.find({ pharmacy: pharmacyId });
      console.log('Medicines:', medicines);
      res.json(medicines);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching medicines' });
    }
  });
  
module.exports = router;
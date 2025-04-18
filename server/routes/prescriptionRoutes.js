const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const router = express.Router();
const { protect, admin } = require('./../middleware');
const multer = require('multer'); 
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/', protect, async (req, res, next) => {
  try {
    await prescriptionController.getAllPrescriptions(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    await prescriptionController.getPrescriptionById(req, res);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    await prescriptionController.updatePrescription(req, res);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await prescriptionController.deletePrescription(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/admin', protect, admin, async (req, res, next) => {
  try {
    await prescriptionController.getAllPrescriptions(req, res);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/verify', protect, admin, async (req, res, next) => {
  try {
    await prescriptionController.verifyPrescription(req, res);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  protect,
  upload.single('prescription'),
  async (req, res, next) => {
    try {
      await prescriptionController.createPrescription(req, res);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
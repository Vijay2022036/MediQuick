const Medicine = require('../models/Medicine');

const getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    next(err);
  }
};

const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (err) {
    next(err);
  }
};

const createMedicine = async (req, res, next) => {
  const med = req.body;
  const pharmacyId = req.user._id; 
  med.pharmacy = pharmacyId; 
  try {
    const newMedicine = new Medicine(med);
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    console.error('Error creating medicine:', err);
    res.status(500).json({ message: 'Error creating medicine' });
  }
};

const getPharmacyMedicines = async (req, res, next) => {
  try {
    const pharmacyId = req.params.pharmacyId;
    const medicines = await Medicine.find({ pharmacy: pharmacyId });
    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ message: 'No medicines found for this pharmacy' });
    }
    res.json(medicines);
  } catch (err) {
    next(err);
  }
};

const updateMedicine = async (req, res, next) => {
  try {
    const { stockQuantity, ...otherFields } = req.body;
    const updateFields = { ...otherFields };
    if (stockQuantity !== undefined) updateFields.stockQuantity = stockQuantity;

    const updatedMedicine = await Medicine.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(updatedMedicine);
  } catch (err) {
    next(err);
  }
};

const deleteMedicine = async (req, res, next) => {
  try {
    const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!deletedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    next(err);
  }
};



module.exports = {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getPharmacyMedicines,
};
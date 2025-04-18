const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  address: { type: String, required: true },
  phone: { type: String, required: true, trim: true },
  licenseNumber: { type: String, required: true, unique: true, trim: true },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'pharmacy',
  },
});

module.exports = mongoose.model('Pharmacy', PharmacySchema);

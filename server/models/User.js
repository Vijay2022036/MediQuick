const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  cartData: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ],
  orders: [
    {
      items: [
        {
          medicine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine',
            required: true
          },
          quantity: {
            type: Number,
            required: true
          }
        }
      ],
      totalAmount: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
      paymentStatus: { type: String, default: 'paid' }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);

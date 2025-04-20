require('dotenv').config();
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const express = require('express'); 
const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cartRoute = require('./routes/cartRoute');
const customerAuthRoutes = require('./routes/customerAuth');
const pharmacyAuthRoutes = require('./routes/pharmacyAuth');
const adminAuthRoutes = require('./routes/adminAuth');
const orderRoutes = require('./routes/orderRoutes');
const medicineRouter = require('./routes/medicineRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Basic route for testing

app.get('/', (req, res) => {
  res.send('Hello from MediQuik Backend!');
});

app.use('/api/cart', cartRoute);
app.use('/api/customer', customerAuthRoutes);
app.use('/api/pharmacy', pharmacyAuthRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/medicines', medicineRouter);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/payment', paymentRoutes);

// General error handling middleware
app.use((err, req, res, next) => { 
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

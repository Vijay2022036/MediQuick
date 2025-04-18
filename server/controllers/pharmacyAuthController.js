const Pharmacy = require("../models/Pharmacy");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerPharmacy = async (req, res) => {
  try {
    const { name, email, password, address, phone, licenseNumber } = req.body;
    let pharmacy = await Pharmacy.findOne({ email });
    if (pharmacy) {
      return res
        .status(400)
        .json({ message: "Pharmacy with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    pharmacy = new Pharmacy({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      licenseNumber,
      role: "pharmacy",
    });

    await pharmacy.save();
    console.log(pharmacy._id);
    const payload = { id: pharmacy._id, role: pharmacy.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      message: "Pharmacy registered successfully",
      token,
      user: {
        id: pharmacy._id,
        name: pharmacy.name,
        email: pharmacy.email,
        address: pharmacy.address,
        phone: pharmacy.phone,
        licenseNumber: pharmacy.licenseNumber,
        role: "pharmacy",
      },
    });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

const loginPharmacy = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pharmacy = await Pharmacy.findOne({ email });
    if (!pharmacy) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, pharmacy.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: pharmacy._id, role: pharmacy.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const verifyPharmacy = async (req, res) => {
  try {
    const pharmacyId = req.params.id;

    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    pharmacy.verified = true;
    await pharmacy.save();

    res.status(200).json({ message: 'Pharmacy verified successfully' });
  } catch (error) {
    console.error('Error verifying pharmacy:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerPharmacy, loginPharmacy , verifyPharmacy };

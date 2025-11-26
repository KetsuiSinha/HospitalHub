const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Check if hospital has admin
exports.checkHospitalAdmin = async (req, res) => {
  try {
    const { hospital } = req.params;

    const existingAdmin = await User.findOne({ hospital, role: "admin" });

    res.json({
      hasAdmin: !!existingAdmin,
      adminEmail: existingAdmin ? existingAdmin.email : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Invite staff member (admin only)
exports.inviteStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { hospital } = req.user; // Get hospital from authenticated admin

    // Check if user with this email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create staff member for the same hospital as the admin
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "staff",
      hospital
    });
    await user.save();

    res.status(201).json({ message: "Staff member invited successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, hospital, city } = req.body;

    // Check if user with this email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Check if this hospital already has an admin
    const existingHospitalAdmin = await User.findOne({ hospital, role: "admin" });
    if (existingHospitalAdmin) {
      return res.status(400).json({
        error: `An admin already exists for ${hospital}. Please contact the existing admin or choose a different hospital.`
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Optional: hard-validate city to be provided for admins
    if (role === "admin" && !city) {
      return res.status(400).json({ error: "City is required for admin signup" });
    }

    const user = new User({ name, email, password: hashedPassword, role, hospital, city });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Signin
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, hospital: user.hospital },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, hospital: user.hospital, city: user.city }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

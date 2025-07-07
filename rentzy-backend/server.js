const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// --- Import your custom modules ---
const connectDB = require('./config/db');
const sendVerificationEmail = require('./utils/sendEmail');
const User = require('./models/User');

// --- Connect to Database ---
connectDB();

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- In-memory store for verification codes (for development) ---
const verificationCodes = {};

// =======================================================
// --- API ENDPOINTS ---
// =======================================================

// 1. SEND VERIFICATION CODE
app.post('/send-verification-code', async (req, res) => {
  // ... (This code is correct and does not need changes)
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

  verificationCodes[email] = { code, expiration };

  try {
    await sendVerificationEmail(email, code);
    console.log(`Verification code sent to ${email} via SendGrid.`);
    res.json({ success: true, message: 'Verification code sent successfully.' });
  } catch (error) {
    console.error("Error sending email via SendGrid:", error);
    res.status(500).json({ success: false, message: 'Failed to send verification code.' });
  }
});


// 2. REGISTER USER
app.post('/register', async (req, res) => {
  // ... (This code is correct and does not need changes)
  const { name, email, password, userType, verificationCode } = req.body;

  const stored = verificationCodes[email];
  if (!stored || stored.code !== verificationCode) {
    return res.status(400).json({ success: false, message: 'Invalid verification code.' });
  }
  if (Date.now() > stored.expiration) {
    return res.status(400).json({ success: false, message: 'Verification code has expired.' });
  }
  
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: userType,
    });

    await user.save();
    delete verificationCodes[email];
    
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- ADDED LOGIN ENDPOINT ---
// 3. LOGIN USER
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
    }

    // If credentials are correct, create and return a token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

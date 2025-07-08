const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const { sendVerificationEmail, sendPasswordResetEmail, sendEmail } = require('./utils/sendEmail');

const User = require('./models/User');

// Import middleware
const { authenticateToken, authorize } = require('./middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validateEmailVerification,
  validateRefreshToken
} = require('./middleware/validation');

// Import centralized API routes
const apiRoutes = require('./routes/index');

// Environment variable validation
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required');
  process.exit(1);
}

connectDB();

const app = express();

// Security middleware - Helmet for secure headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    },
  },
}));

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept',
    'Origin',
    'X-Requested-With',
    'X-CSRF-Token'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// CRITICAL FIX: Use CORS middleware BEFORE rate limiting
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper function to exempt OPTIONS requests from rate limiting
const applyRateLimit = (limiter) => (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  return limiter(req, res, next);
};

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: { 
    success: false, 
    message: 'Too many authentication attempts, please try again in 15 minutes.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { 
    success: false, 
    message: 'Too many requests, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting with OPTIONS exemption
app.use('/send-verification-code', applyRateLimit(authLimiter));
app.use('/register', applyRateLimit(authLimiter));
app.use('/login', applyRateLimit(authLimiter));
app.use('/api/auth', applyRateLimit(authLimiter));
app.use(generalLimiter);

// Enhanced verification code storage with attempt tracking
const verificationCodes = {};

// Cleanup expired verification codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(verificationCodes).forEach(email => {
    if (verificationCodes[email].expiration < now) {
      delete verificationCodes[email];
    }
  });
}, 5 * 60 * 1000);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running successfully',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// SEND VERIFICATION CODE with validation middleware
app.post('/send-verification-code', validateEmailVerification, async (req, res) => {
  const { email } = req.body;
  const emailLower = email.toLowerCase();

  // Check for existing attempts
  const existing = verificationCodes[emailLower];
  if (existing && existing.attempts >= 3) {
    return res.status(429).json({
      success: false,
      message: 'Too many verification attempts. Please try again later.'
    });
  }

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes

    verificationCodes[emailLower] = { 
      code, 
      expiration,
      attempts: existing ? existing.attempts + 1 : 1,
      maxAttempts: 3
    };

    await sendVerificationEmail(email, code);
    
    console.log(`Verification code sent to ${email}: ${code}`);
    res.json({ 
      success: true, 
      message: 'Verification code sent successfully.',
      expiresIn: '10 minutes'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send verification code. Please try again.' 
    });
  }
});

// REGISTER USER with validation middleware
app.post('/register', validateRegistration, async (req, res) => {
  console.log('Registration request received:', {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    verificationCode: req.body.verificationCode ? '[PROVIDED]' : '[MISSING]',
    password: req.body.password ? '[PROVIDED]' : '[MISSING]',
    confirmPassword: req.body.confirmPassword ? '[PROVIDED]' : '[MISSING]'
  });

  const { name, email, password, verificationCode, role } = req.body;
  const emailLower = email.toLowerCase();

  try {
    // Enhanced verification code checking
    const stored = verificationCodes[emailLower];
    if (!stored) {
      return res.status(400).json({ 
        success: false, 
        message: 'No verification code found. Please request a new one.' 
      });
    }

    if (stored.code !== verificationCode) {
      stored.attempts = (stored.attempts || 0) + 1;
      if (stored.attempts >= stored.maxAttempts) {
        delete verificationCodes[emailLower];
        return res.status(429).json({ 
          success: false, 
          message: 'Too many invalid attempts. Please request a new verification code.' 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: `Invalid verification code. ${stored.maxAttempts - stored.attempts} attempts remaining.` 
      });
    }
    
    if (Date.now() > stored.expiration) {
      delete verificationCodes[emailLower];
      return res.status(400).json({ 
        success: false, 
        message: 'Verification code has expired. Please request a new one.' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'An account with this email already exists.' 
      });
    }

    // Enhanced password hashing
    const saltRounds = 14; // Increased for better security
    const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);
    
    // Create user with additional security fields
    const user = await User.create({ 
      name: name.trim(), 
      email: emailLower, 
      password: hashedPassword, 
      role,
      isEmailVerified: true,
      createdAt: new Date(),
      lastLogin: new Date()
    });

    // Clean up verification code
    delete verificationCodes[emailLower];

    // Generate JWT with enhanced payload
    const tokenPayload = {
      user: { 
        id: user.id, 
        role: user.role,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { 
      expiresIn: '24h',
      issuer: 'rentzy-app',
      audience: 'rentzy-users'
    });

    // Generate refresh token (optional for enhanced security)
    const refreshToken = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    console.log('User registered successfully:', user.email);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      refreshToken,
      expiresIn: '24h',
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// LOGIN USER with validation middleware
app.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;
  const emailLower = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }

    // Update last login
    await User.findByIdAndUpdate(user.id, { lastLogin: new Date() });

    const tokenPayload = {
      user: { 
        id: user.id, 
        role: user.role,
        email: user.email,
        isEmailVerified: user.isEmailVerified || true
      }
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { 
      expiresIn: '24h',
      issuer: 'rentzy-app',
      audience: 'rentzy-users'
    });

    const refreshToken = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    console.log('User logged in successfully:', user.email);

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      expiresIn: '24h',
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isEmailVerified: user.isEmailVerified || true
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});

// Mount all API routes through centralized index
app.use('/api', apiRoutes);

// Admin-only route example
app.get('/admin/users', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users' 
    });
  }
});

// Logout endpoint with token invalidation
app.post('/logout', authenticateToken, (req, res) => {
  // In production, you might want to blacklist the token
  // For now, we'll just send a success response
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Refresh token endpoint with validation middleware
app.post('/refresh-token', validateRefreshToken, async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const newAccessToken = jwt.sign(
      { 
        user: { 
          id: user.id, 
          role: user.role,
          email: user.email,
          isEmailVerified: user.isEmailVerified || true
        }
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: '24h',
        issuer: 'rentzy-app',
        audience: 'rentzy-users'
      }
    );

    res.json({
      success: true,
      accessToken: newAccessToken,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation'
    });
  }
  
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🛡️  Security features enabled: Helmet, Rate Limiting, Enhanced CORS`);
  console.log(`📋 Available API routes:`);
  console.log(`   • API Health: /api/health`);
  console.log(`   • Authentication: /api/auth/*`);
  console.log(`   • Tenant routes: /api/tenant/*`);
  console.log(`   • Homeowner routes: /api/homeowner/*`);
  console.log(`   • Direct auth: /login, /register, /logout, /refresh-token`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

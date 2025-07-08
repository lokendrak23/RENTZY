const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const tenantRoutes = require('./tenant');
const homeownerRoutes = require('./homeowner');

// Mount routes with their respective prefixes
router.use('/auth', authRoutes);
router.use('/tenant', tenantRoutes);
router.use('/homeowner', homeownerRoutes);

// API health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API routes are working',
    timestamp: new Date().toISOString(),
    availableRoutes: {
      auth: [
        'GET /api/auth/verify-token',
        'GET /api/auth/profile',
        'PUT /api/auth/profile'
      ],
      tenant: [
        'GET /api/tenant/dashboard',
        'GET /api/tenant/profile',
        'GET /api/tenant/applications',
        'GET /api/tenant/saved-properties',
        'POST /api/tenant/apply-property'
      ],
      homeowner: [
        'GET /api/homeowner/dashboard',
        'GET /api/homeowner/profile',
        'GET /api/homeowner/properties',
        'GET /api/homeowner/applications',
        'PUT /api/homeowner/applications/:applicationId',
        'POST /api/homeowner/properties'
      ]
    }
  });
});

// Error handling middleware for API routes
router.use((err, req, res, next) => {
  console.error(`API Error in ${req.originalUrl}:`, err);
  res.status(500).json({
    success: false,
    message: 'API internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const User = require('../models/User');

// Tenant dashboard data
router.get('/dashboard', authenticateToken, authorize(['tenant']), async (req, res) => {
  try {
    // In a real app, you'd fetch this data from your database
    const tenantData = {
      recentApplications: [
        {
          id: 1,
          propertyTitle: "Modern 2BHK Apartment",
          status: "pending",
          appliedDate: new Date().toISOString(),
          rent: 25000
        }
      ],
      savedProperties: [
        {
          id: 1,
          title: "Cozy 1BHK Near Metro",
          rent: 18000,
          location: "Sector 18, Noida",
          savedDate: new Date().toISOString()
        }
      ],
      notifications: [
        {
          id: 1,
          message: "Your application for Modern 2BHK Apartment is under review",
          type: "info",
          date: new Date().toISOString(),
          read: false
        }
      ],
      stats: {
        totalApplications: 3,
        pendingApplications: 1,
        savedProperties: 5
      },
      profile: {
        id: req.user.id,
        name: req.user.name || 'Tenant',
        email: req.user.email,
        role: req.user.role
      }
    };
    
    res.json({
      success: true,
      data: tenantData
    });
  } catch (error) {
    console.error('Tenant dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch tenant dashboard data' 
    });
  }
});

// Tenant profile (role-specific)
router.get('/profile', authenticateToken, authorize(['tenant']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified || true,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        // Tenant-specific fields
        preferences: {
          maxRent: 30000,
          preferredLocations: ["Noida", "Gurgaon"],
          propertyType: "apartment"
        }
      }
    });
  } catch (error) {
    console.error('Tenant profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile' 
    });
  }
});

// Get tenant applications
router.get('/applications', authenticateToken, authorize(['tenant']), async (req, res) => {
  try {
    // In a real app, fetch from applications collection
    const applications = [
      {
        id: 1,
        propertyId: 101,
        propertyTitle: "Modern 2BHK Apartment",
        propertyLocation: "Sector 62, Noida",
        rent: 25000,
        status: "pending",
        appliedDate: new Date().toISOString(),
        landlordName: "John Doe",
        landlordContact: "+91-9876543210"
      },
      {
        id: 2,
        propertyId: 102,
        propertyTitle: "Spacious 3BHK House",
        propertyLocation: "DLF Phase 2, Gurgaon",
        rent: 35000,
        status: "approved",
        appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        landlordName: "Jane Smith",
        landlordContact: "+91-9876543211"
      }
    ];

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Tenant applications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch applications' 
    });
  }
});

// Get saved properties
router.get('/saved-properties', authenticateToken, authorize(['tenant']), async (req, res) => {
  try {
    // In a real app, fetch from saved properties collection
    const savedProperties = [
      {
        id: 1,
        title: "Cozy 1BHK Near Metro",
        rent: 18000,
        location: "Sector 18, Noida",
        amenities: ["Parking", "Gym", "Security"],
        savedDate: new Date().toISOString(),
        images: ["property1.jpg"]
      },
      {
        id: 2,
        title: "Luxury 2BHK Apartment",
        rent: 28000,
        location: "Cyber City, Gurgaon",
        amenities: ["Swimming Pool", "Gym", "Garden"],
        savedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        images: ["property2.jpg"]
      }
    ];

    res.json({
      success: true,
      savedProperties
    });
  } catch (error) {
    console.error('Saved properties error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch saved properties' 
    });
  }
});

// Apply for a property
router.post('/apply-property', authenticateToken, authorize(['tenant']), async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    
    // In a real app, save to applications collection
    const application = {
      id: Date.now(), // Use proper ID generation in real app
      tenantId: req.user.id,
      propertyId,
      message: message || '',
      status: 'pending',
      appliedDate: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Property application error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application' 
    });
  }
});

module.exports = router;

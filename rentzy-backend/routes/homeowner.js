const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const User = require('../models/User');

// Homeowner dashboard data
router.get('/dashboard', authenticateToken, authorize(['homeowner']), async (req, res) => {
  try {
    // In a real app, you'd fetch this data from your database
    const homeownerData = {
      properties: [
        {
          id: 1,
          title: "Modern 2BHK Apartment",
          location: "Sector 62, Noida",
          rent: 25000,
          status: "occupied",
          tenant: "Alice Johnson",
          listingDate: new Date().toISOString()
        },
        {
          id: 2,
          title: "Spacious 3BHK House",
          location: "DLF Phase 2, Gurgaon",
          rent: 35000,
          status: "vacant",
          tenant: null,
          listingDate: new Date().toISOString()
        }
      ],
      tenantApplications: [
        {
          id: 1,
          propertyId: 2,
          propertyTitle: "Spacious 3BHK House",
          tenantName: "Bob Smith",
          tenantEmail: "bob@example.com",
          tenantPhone: "+91-9876543210",
          appliedDate: new Date().toISOString(),
          status: "pending",
          message: "I'm interested in renting this property for my family."
        }
      ],
      earnings: {
        total: 125000,
        thisMonth: 25000,
        lastMonth: 35000,
        occupancyRate: 75
      },
      notifications: [
        {
          id: 1,
          message: "New application received for Spacious 3BHK House",
          type: "info",
          date: new Date().toISOString(),
          read: false
        }
      ],
      stats: {
        totalProperties: 2,
        occupiedProperties: 1,
        vacantProperties: 1,
        pendingApplications: 1
      },
      profile: {
        id: req.user.id,
        name: req.user.name || 'Homeowner',
        email: req.user.email,
        role: req.user.role
      }
    };
    
    res.json({
      success: true,
      data: homeownerData
    });
  } catch (error) {
    console.error('Homeowner dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch homeowner dashboard data' 
    });
  }
});

// Homeowner profile (role-specific)
router.get('/profile', authenticateToken, authorize(['homeowner']), async (req, res) => {
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
        // Homeowner-specific fields
        businessInfo: {
          totalProperties: 2,
          yearsInBusiness: 3,
          averageRating: 4.5,
          totalEarnings: 125000
        }
      }
    });
  } catch (error) {
    console.error('Homeowner profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile' 
    });
  }
});

// Get homeowner properties
router.get('/properties', authenticateToken, authorize(['homeowner']), async (req, res) => {
  try {
    // In a real app, fetch from properties collection
    const properties = [
      {
        id: 1,
        title: "Modern 2BHK Apartment",
        description: "A beautiful modern apartment with all amenities",
        location: "Sector 62, Noida",
        rent: 25000,
        deposit: 50000,
        status: "occupied",
        tenant: {
          name: "Alice Johnson",
          email: "alice@example.com",
          phone: "+91-9876543210",
          moveInDate: "2024-01-15"
        },
        amenities: ["Parking", "Gym", "Security", "Power Backup"],
        images: ["property1.jpg", "property1_2.jpg"],
        listingDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: 2,
        title: "Spacious 3BHK House",
        description: "A spacious house perfect for families",
        location: "DLF Phase 2, Gurgaon",
        rent: 35000,
        deposit: 70000,
        status: "vacant",
        tenant: null,
        amenities: ["Garden", "Parking", "Security"],
        images: ["property2.jpg"],
        listingDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Homeowner properties error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch properties' 
    });
  }
});

// Get tenant applications for homeowner's properties
router.get('/applications', authenticateToken, authorize(['homeowner']), async (req, res) => {
  try {
    // In a real app, fetch applications for this homeowner's properties
    const applications = [
      {
        id: 1,
        propertyId: 2,
        propertyTitle: "Spacious 3BHK House",
        tenant: {
          id: 101,
          name: "Bob Smith",
          email: "bob@example.com",
          phone: "+91-9876543210"
        },
        appliedDate: new Date().toISOString(),
        status: "pending",
        message: "I'm interested in renting this property for my family. I work in IT and have a stable income.",
        documents: ["id_proof.pdf", "salary_slip.pdf"]
      },
      {
        id: 2,
        propertyId: 2,
        propertyTitle: "Spacious 3BHK House",
        tenant: {
          id: 102,
          name: "Carol Davis",
          email: "carol@example.com",
          phone: "+91-9876543211"
        },
        appliedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        message: "Looking for a long-term rental. I'm a software engineer with 5 years of experience.",
        documents: ["id_proof.pdf", "salary_slip.pdf", "bank_statement.pdf"]
      }
    ];

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Homeowner applications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch applications' 
    });
  }
});

// Update application status (approve/reject)
router.put('/applications/:applicationId', authenticateToken, authorize(['homeowner']), async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, message } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved or rejected.'
      });
    }

    // In a real app, update the application in database
    const updatedApplication = {
      id: applicationId,
      status,
      responseMessage: message || '',
      responseDate: new Date().toISOString()
    };

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      application: updatedApplication
    });
  } catch (error) {
    console.error('Application update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update application' 
    });
  }
});

// Add new property
router.post('/properties', authenticateToken, authorize(['homeowner']), async (req, res) => {
  try {
    const { title, description, location, rent, deposit, amenities } = req.body;
    
    // In a real app, save to properties collection
    const property = {
      id: Date.now(), // Use proper ID generation in real app
      ownerId: req.user.id,
      title,
      description,
      location,
      rent: parseInt(rent),
      deposit: parseInt(deposit),
      amenities: amenities || [],
      status: 'vacant',
      listingDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Property added successfully',
      property
    });
  } catch (error) {
    console.error('Add property error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add property' 
    });
  }
});

module.exports = router;

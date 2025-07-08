const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');

// Token verification endpoint - for persistent login
router.get('/verify-token', authenticateToken, async (req, res) => {
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
        isEmailVerified: user.isEmailVerified || true
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Token verification failed' 
    });
  }
});

// Get user profile (general)
router.get('/profile', authenticateToken, async (req, res) => {
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
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile' 
    });
  }
});

// Update user profile with validation
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const { name } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified || true
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile' 
    });
  }
});

// ========== PASSWORD RESET FUNCTIONALITY ==========

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email input
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check rate limiting
    const now = new Date();
    const oneHour = 60 * 60 * 1000;
    
    if (user.lastPasswordResetAttempt && 
        (now - user.lastPasswordResetAttempt) < oneHour && 
        user.passwordResetAttempts >= 3) {
      return res.status(429).json({ 
        success: false,
        message: 'Too many reset attempts. Please try again later.' 
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    user.passwordResetAttempts = (user.passwordResetAttempts || 0) + 1;
    user.lastPasswordResetAttempt = now;
    
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Rentzy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your Rentzy account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated message from Rentzy. Please do not reply to this email.</p>
        </div>
      `
    });

    res.json({ 
      success: true,
      message: 'Password reset email sent successfully' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Reset password with token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({ 
        success: false,
        message: 'Password is required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Find user with valid reset token (using your custom static method)
    const user = await User.findByValidResetToken(token);
    
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset fields
    user.password = hashedPassword;
    user.clearPasswordResetToken(); // Using your custom method
    
    await user.save();

    res.json({ 
      success: true,
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Verify reset token (optional - for frontend validation)
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findByValidResetToken(token);
    
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset token' 
      });
    }

    res.json({ 
      success: true,
      message: 'Token is valid',
      email: user.email // You can return email for display purposes
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

module.exports = router;

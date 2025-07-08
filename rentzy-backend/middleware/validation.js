const { body, validationResult } = require('express-validator');

// Custom validation middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

// Email validation rules
const validateEmail = () => {
  return body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
    .isLength({ max: 254 })
    .withMessage('Email too long');
};

// Password validation rules
const validatePassword = () => {
  return body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');
};

// Name validation rules
const validateName = () => {
  return body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces');
};

// Confirm password validation
const validateConfirmPassword = () => {
  return body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    });
};

// Verification code validation
const validateVerificationCode = () => {
  return body('verificationCode')
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be 6 digits')
    .isNumeric()
    .withMessage('Verification code must contain only numbers');
};

// Role validation
const validateRole = () => {
  return body('role')
    .isIn(['tenant', 'homeowner'])
    .withMessage('Role must be tenant or homeowner');
};

// Phone validation (optional)
const validatePhone = () => {
  return body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number');
};

// Registration validation chain
const validateRegistration = [
  validateName(),
  validateEmail(),
  validatePassword(),
  validateConfirmPassword(),
  validateVerificationCode(),
  validateRole(),
  handleValidationErrors
];

// Login validation chain
const validateLogin = [
  validateEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 128 })
    .withMessage('Password length invalid'),
  handleValidationErrors
];

// Email verification request validation
const validateEmailVerification = [
  validateEmail(),
  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  validateEmail(),
  validateVerificationCode(),
  validatePassword(),
  validateConfirmPassword(),
  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
    .isLength({ max: 254 })
    .withMessage('Email too long'),
  
  validatePhone(),
  handleValidationErrors
];

// Change password validation
const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New passwords do not match');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Refresh token validation
const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
  handleValidationErrors
];

// Custom validation for specific fields
const validateField = (fieldName, rules) => {
  return [
    body(fieldName).custom(rules),
    handleValidationErrors
  ];
};

// Export all validation middlewares
module.exports = {
  // Main validation chains
  validateRegistration,
  validateLogin,
  validateEmailVerification,
  validatePasswordReset,
  validateProfileUpdate,
  validateChangePassword,
  validateRefreshToken,
  
  // Individual validators
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  validateVerificationCode,
  validateRole,
  validatePhone,
  
  // Utility functions
  handleValidationErrors,
  validateField
};

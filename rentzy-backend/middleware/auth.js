const jwt = require('jsonwebtoken');

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required',
      code: 'TOKEN_MISSING'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid token',
          code: 'TOKEN_INVALID'
        });
      } else {
        return res.status(403).json({ 
          success: false, 
          message: 'Token verification failed',
          code: 'TOKEN_VERIFICATION_FAILED'
        });
      }
    }
    req.user = decoded.user;
    next();
  });
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = { authenticateToken, authorize };

const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const authenticateAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Access denied. User not authenticated.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. User is not an admin.' });
  }

  next();
};

module.exports = { authenticate, authenticateAdmin };

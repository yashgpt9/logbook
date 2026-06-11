const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided.' });

  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format.' });
  }

  jwt.verify(tokenParts[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized!' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Requires Admin role!' });
  }
  next();
};

module.exports = { verifyToken, requireAdmin };

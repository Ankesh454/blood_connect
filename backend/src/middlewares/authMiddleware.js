const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Authentication required' });
  if (!process.env.JWT_SECRET) return res.status(503).json({ message: 'Authentication is not configured' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin' && typeof decoded.username === 'string') {
      req.admin = true;
      req.user = { role: 'admin', username: decoded.username };
      return next();
    }
    if (!decoded.id) return res.status(401).json({ message: 'Invalid authentication token' });
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid authentication token' });
    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
};

const requireAdmin = (req, res, next) => req.admin ? next() : res.status(403).json({ message: 'Admin access required' });
const requireRole = (...roles) => (req, res, next) => {
  if (req.admin && roles.includes('admin')) return next();
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'You are not allowed to perform this action' });
  if (req.user.role === 'hospital' && req.user.approvalStatus !== 'approved') return res.status(403).json({ message: 'Hospital account approval is required' });
  return next();
};
const preventAdminAction = (req, res, next) => req.admin || req.user?.role === 'admin'
  ? res.status(403).json({ message: 'Admin account is restricted from this action.' }) : next();

module.exports = { protect, requireAdmin, requireRole, preventAdminAction };

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  requestedRole: user.requestedRole,
  approvalStatus: user.approvalStatus,
  bloodGroup: user.bloodGroup,
  phone: user.phone,
  city: user.city,
  token: generateToken(user._id),
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, bloodGroup, city } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ message: 'Password must be between 8 and 128 characters' });
    if (role && !['user', 'hospital'].includes(role)) return res.status(400).json({ message: 'Choose User or Hospital account' });
    const requestedHospital = role === 'hospital';
    if (!requestedHospital && bloodGroup && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(bloodGroup)) return res.status(400).json({ message: 'Invalid blood group' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists' });
    const user = await User.create({
      name: name.trim(), email: normalizedEmail, password, phone: phone?.trim() || '',
      role: 'user', requestedRole: requestedHospital ? 'hospital' : undefined,
      approvalStatus: requestedHospital ? 'pending' : 'none',
      bloodGroup: requestedHospital ? 'All' : bloodGroup || undefined, city: city?.trim() || '',
    });
    return res.status(201).json(publicUser(user));
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists' });
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Unable to register account' });
  }
};

const getCurrentUser = (req, res) => res.json({
  _id: req.user._id, name: req.user.name, email: req.user.email,
  role: req.user.role, requestedRole: req.user.requestedRole,
  approvalStatus: req.user.approvalStatus, bloodGroup: req.user.bloodGroup,
  phone: req.user.phone, city: req.user.city,
});

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email?.trim() || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
    return res.json(publicUser(user));
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to sign in' });
  }
};

module.exports = { registerUser, authUser, getCurrentUser };

import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
export const googleCallback = (req, res) => {
  // On success, issue JWT token
  const user = req.user;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.redirect(`/login?token=${token}`);
};


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    // Store SHA-256 hash directly
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'User registered', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    // Compare SHA-256 hashes directly
    if (user.password !== password) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
// Refresh token endpoint
export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const oauthCallback = (req, res) => {
  // Placeholder for OAuth 2.0 callback logic
  res.json({ message: 'OAuth callback not implemented' });
};
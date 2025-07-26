import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import CryptoJS from 'crypto-js';

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password too short' });
    const hashed = CryptoJS.SHA256(password).toString();
    await User.findByIdAndUpdate(req.user.id, { password: hashed });
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password', error: err.message });
  }
};

export const deleteUserAndData = async (req, res) => {
  try {
    await Transaction.deleteMany({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'User and all data deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
};

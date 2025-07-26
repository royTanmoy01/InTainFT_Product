import Transaction from '../models/Transaction.js';
export const deleteUserAndData = async (req, res) => {
  try {
    await Transaction.deleteMany({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'User and all data deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
};

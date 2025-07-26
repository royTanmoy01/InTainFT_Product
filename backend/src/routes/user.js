import express from 'express';
import { getUserProfile, deleteUserAndData, getMe, changePassword } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, getUserProfile);
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, changePassword);
router.delete('/delete', authenticate, deleteUserAndData);

export default router;

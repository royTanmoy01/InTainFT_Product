import express from 'express';
import { getUserProfile, deleteUserAndData } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, getUserProfile);
router.delete('/delete', authenticate, deleteUserAndData);

export default router;


import express from 'express';
import passport from 'passport';
import { googleAuth, googleCallback, register, login, oauthCallback, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/oauth/callback', oauthCallback);

export default router;

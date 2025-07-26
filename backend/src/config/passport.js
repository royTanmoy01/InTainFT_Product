import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
console.log('[passport.js] GOOGLE_CLIENT_ID:', googleClientId);
console.log('[passport.js] GOOGLE_CLIENT_SECRET:', googleClientSecret);
if (!googleClientId || !googleClientSecret) {
  console.warn('[passport.js] Google OAuth credentials missing: GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET not set. Google login will be disabled.');
}
if (googleClientId && googleClientSecret) {
  passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      // Set a random password for Google users to satisfy Mongoose validation
      user = await User.create({ name: profile.displayName, email: profile.emails[0].value, password: Math.random().toString(36).slice(-12) });
    }
    return done(null, user);
  }));
}

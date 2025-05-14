// routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import { issueJwtForGoogleUser } from '../controllers/googleauth.controller.js';

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  issueJwtForGoogleUser
);

export default router;

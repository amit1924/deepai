import express from 'express';
import {
  signup,
  login,
  logout,
  updateProfile,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createRateLimiter } from '../lib/limiter.js';

const router = express.Router();

// Auth routes: stricter limits
createRateLimiter(router, {
  limit: 50,
  windowMs: 15 * 60 * 1000,
  message: 'Too many auth requests, try again in 15 minutes.',
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);

// routes/auth.routes.js
router.get('/check', protectRoute, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;

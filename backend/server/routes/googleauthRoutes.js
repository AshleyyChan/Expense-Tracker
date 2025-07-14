const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// ✅ Step 1: Initiate Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// ✅ Step 2: Google redirects here after auth
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://expense-tracker-sage-one-34.vercel.app/login',
    session: false
  }),
  (req, res) => {
    try {
      // 🔐 Generate JWT token
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      // 🌐 Redirect to frontend with token as query param
      res.redirect(`https://expense-tracker-sage-one-34.vercel.app/dashboard?token=${token}`);
    } catch (err) {
      console.error('❌ Google Auth Callback Error:', err);
      res.redirect('https://expense-tracker-sage-one-34.vercel.app/login?error=token_failed');
    }
  }
);

module.exports = router;

module.exports = router;

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 👉 Step 1: Trigger Google Login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// 👉 Step 2: Google Redirects Back Here
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Generate JWT for the logged-in user
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // ✅ Redirect to frontend with the token
    res.redirect(`https://expense-tracker-sage-one-34.vercel.app/dashboard?token=${token}`);
  }
);

module.exports = router;

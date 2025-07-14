// ✅ Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

// ✅ App init
const app = express();

// ✅ Load custom passport Google strategy
require('./passport');

// ✅ Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ CORS Config
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://expense-tracker-sage-one-34.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Body parser
app.use(express.json());

// ✅ Express session middleware (needed if using Passport sessions)
app.use(session({
  secret: 'some-secret-key', // change to a secure one in prod
  resave: false,
  saveUninitialized: false
}));

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/auth', require('./routes/googleauthRoutes')); // ✅ Google OAuth
app.use('/api/expenses', require('./routes/expenseRoutes'));

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

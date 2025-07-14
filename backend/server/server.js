// ✅ Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

// ✅ App init
const app = express();

// ✅ Load Passport config (Google Strategy)
require('./passport');

// ✅ Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://expense-tracker-sage-one-34.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ Express session (needed if using passport session)
app.use(session({
  secret: 'replace-this-with-a-secure-secret', // 🔐 important in production!
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // set to true in production (HTTPS)
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// ✅ Initialize passport
app.use(passport.initialize());
app.use(passport.session()); // if using persistent sessions (optional)

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes')); // email + password
app.use('/auth', require('./routes/googleauthRoutes')); // google login/signup
app.use('/api/expenses', require('./routes/expenseRoutes')); // expense CRUD

// ✅ Default route
app.get('/', (req, res) => {
  res.send('✅ Expense Tracker API is running...');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

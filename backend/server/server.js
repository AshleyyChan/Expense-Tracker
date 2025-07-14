// ✅ Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); // Needed for Passport (optional but safe)
require('./passport'); // ✅ Load Passport Google strategy

const app = express();

// ✅ Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ CORS Config
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://expense-tracker-sage-one-34.vercel.app' // your frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Body Parser
app.use(express.json());

// ✅ Express session (needed if using session-based Passport, even if not always used)
app.use(session({
  secret: 'some-secret-key',
  resave: false,
  saveUninitialized: false
}));

// ✅ Passport Init
app.use(passport.initialize());
app.use(passport.session());

// ✅ MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/auth', require('./routes/googleauthRoutes')); // separate file for Google auth
app.use('/api/expenses', require('./routes/expenseRoutes'));

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

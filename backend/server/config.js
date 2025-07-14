require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "your-backup-uri",
  JWT_SECRET: process.env.JWT_SECRET || "backup-jwt-secret"
};

// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

//   if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.id;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

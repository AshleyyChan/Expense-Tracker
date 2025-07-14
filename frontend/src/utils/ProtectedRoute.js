// ✅ src/utils/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './auth'; // Checks if JWT token exists in localStorage

function ProtectedRoute({ children }) {
  // 🔐 If user is logged in, allow access
  if (isLoggedIn()) {
    return children;
  }

  // 🚫 If not logged in, redirect to login page
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;

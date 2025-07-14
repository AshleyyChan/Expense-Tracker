// ✅ src/utils/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './auth'; // Checks localStorage

function ProtectedRoute({ children }) {
  const urlToken = new URLSearchParams(window.location.search).get('token');

  // 🔐 Allow access if logged in or token present in URL
  if (isLoggedIn() || urlToken) {
    return children;
  }

  // 🚫 If not logged in, redirect to login page
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;

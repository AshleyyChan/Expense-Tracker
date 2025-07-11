// ✅ src/utils/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './auth';

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}

export default ProtectedRoute; // ✅ MUST BE default export

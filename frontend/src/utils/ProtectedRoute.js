// src/utils/ProtectedRoute.js
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [token, setToken] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("token");
    setToken(stored);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return <div className="text-center mt-5">⏳ Checking login...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

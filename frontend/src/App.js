import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import AddExpense from "./components/AddExpense";
import ExpenseList from "./components/ExpenseList";
import Dashboard from "./components/dashboard/dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import OAuthHandler from "./pages/OAuthHandler";

// ✅ Custom Navbar
function Navbar({ token, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // update state
    navigate("/login");
  };

  return (
    <nav
      className="navbar shadow-sm px-4 py-3 d-flex justify-content-between align-items-center"
      style={{
        backdropFilter: "blur(15px)",
        background: "rgba(255, 255, 255, 0.12)",
        borderBottom: "1px solid rgba(255,255,255,0.25)",
        borderRadius: "0 0 20px 20px",
        fontFamily: "'Poppins', sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Link
        to="/"
        className="navbar-brand fw-bold fs-4 text-primary text-decoration-none"
      >
        💸 ExpenseTracker
      </Link>

      <div className="d-flex align-items-center gap-2">
        {token ? (
          <>
            <Link to="/dashboard" className="btn btn-sm btn-outline-primary">
              Dashboard
            </Link>
            <Link to="/add" className="btn btn-sm btn-outline-success">
              Add Expense
            </Link>
            <Link to="/list" className="btn btn-sm btn-outline-info">
              My Expenses
            </Link>
            <button onClick={handleLogout} className="btn btn-sm btn-danger">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-primary text-white">
              Login
            </Link>
            <Link to="/signup" className="btn btn-sm btn-success text-white">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ✅ Layout wrapper with Navbar
function Layout({ children, token, setToken }) {
  return (
    <>
      <Navbar token={token} setToken={setToken} />
      <div className="container mt-4 mb-5">{children}</div>
    </>
  );
}

// ✅ Public Welcome Page
function Welcome() {
  return (
    <div
      className="text-center"
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1 className="mb-4">💰 Welcome to Expense Tracker</h1>
      <p className="mb-4 text-muted">
        Track your expenses, visualize spending, and save smarter.
      </p>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/signup" className="btn btn-success btn-lg">
          Sign Up
        </Link>
        <Link to="/login" className="btn btn-primary btn-lg">
          Login
        </Link>
      </div>
    </div>
  );
}

// ✅ Main App
export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 🔄 Sync with localStorage when token is set outside React (e.g., OAuthHandler)
  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<OAuthHandler />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout token={token} setToken={setToken}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <Layout token={token} setToken={setToken}>
                <AddExpense />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <Layout token={token} setToken={setToken}>
                <ExpenseList />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

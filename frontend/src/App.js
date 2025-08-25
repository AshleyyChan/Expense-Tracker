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
    setToken("");
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
        to={token ? "/dashboard" : "/"}
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

// ✅ Enhanced Public Welcome Page with Highlights
function Welcome() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="shadow-lg text-center p-5"
        style={{
          maxWidth: "700px",
          width: "100%",
          borderRadius: "25px",
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff",
          animation: "fadeInUp 1s ease",
        }}
      >
        <h1
          className="fw-bold mb-3"
          style={{ fontSize: "2.8rem", textShadow: "2px 2px 8px rgba(0,0,0,0.3)" }}
        >
          💰 Expense Tracker
        </h1>
        <p className="mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>
          Track your spending, stay on budget, and save smarter.
        </p>

        {/* ✅ Key Features */}
        <div className="text-start mb-4" style={{ lineHeight: "1.8" }}>
          <h5 className="fw-bold text-warning mb-3">✨ Why use Expense Tracker?</h5>
          <ul style={{ listStyle: "none", paddingLeft: 0, fontSize: "1rem" }}>
            <li>✅ Add and categorize your daily expenses</li>
            <li>✅ Visualize spending trends on your dashboard</li>
            <li>✅ Keep track of total and monthly budgets</li>
            <li>✅ Secure login with Google authentication</li>
            <li>✅ Access anytime, anywhere on any device</li>
          </ul>
        </div>

        {/* ✅ Action Buttons */}
        <div className="d-flex justify-content-center gap-3">
          <Link
            to="/signup"
            className="btn px-4 py-2 fw-bold"
            style={{
              borderRadius: "12px",
              background: "linear-gradient(90deg, #28a745, #20c997)",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            🚀 Get Started
          </Link>
          <Link
            to="/login"
            className="btn px-4 py-2 fw-bold"
            style={{
              borderRadius: "12px",
              background: "linear-gradient(90deg, #007bff, #00b4d8)",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            🔑 Login
          </Link>
        </div>
      </div>

      {/* Simple animation */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


// ✅ Main App
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  // 🔄 Sync with localStorage when token changes outside React (e.g., OAuthHandler)
  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token") || "");
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/auth/callback"
          element={<OAuthHandler setToken={setToken} />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Layout token={token} setToken={setToken}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute token={token}>
              <Layout token={token} setToken={setToken}>
                <AddExpense />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list"
          element={
            <ProtectedRoute token={token}>
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

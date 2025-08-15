import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/dashboard/dashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import { logout, isLoggedIn } from './utils/auth';
import OAuthHandler from './pages/OAuthHandler';

// ✅ Layout wrapper for protected pages with navbar
function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/dashboard">💰 Expense Tracker</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              {isLoggedIn() && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} to="/dashboard">🏠 Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/add') ? 'active' : ''}`} to="/add">➕ Add Expense</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/list') ? 'active' : ''}`} to="/list">📋 View Expenses</Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4 mb-5">{children}</div>
    </div>
  );
}

// ✅ Welcome / Landing page
function Welcome() {
  return (
    <div
      className="text-center"
      style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <h1 className="mb-4">💰 Welcome to Expense Tracker</h1>
      <p className="mb-4 text-muted">Track your expenses, visualize spending, and save smarter.</p>
      <div className="d-flex justify-content-center gap-3">
        <Link className="btn btn-success btn-lg" to="/signup">Sign Up</Link>
        <Link className="btn btn-primary btn-lg" to="/login">Login</Link>
      </div>
    </div>
  );
}

// ✅ Main App component with routes
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing / Welcome */}
        <Route path="/" element={<Welcome />} />

        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<OAuthHandler />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <Layout><AddExpense /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <Layout><ExpenseList /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

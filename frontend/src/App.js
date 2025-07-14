import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';

import Signup from './components/Signup';
import Login from './components/Login';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/dashboard/dashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import { logout, isLoggedIn } from './utils/auth';
import OAuthHandler from './pages/OAuthHandler';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ✅ Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">💰 Expense Tracker</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              {!isLoggedIn() ? (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/signup') ? 'active' : ''}`} to="/signup">Signup</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/login') ? 'active' : ''}`} to="/login">Login</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/add') ? 'active' : ''}`} to="/add">Add Expense</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/list') ? 'active' : ''}`} to="/list">View Expenses</Link>
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

      {/* ✅ Page Container */}
      <div className="container mt-4 mb-5">
        <Routes>
          {/* Default route - go to signup */}
          <Route path="/" element={<Navigate to="/signup" />} />

          {/* Auth Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* 🔓 This route handles Google token and redirects */}
          <Route path="/auth/callback" element={<OAuthHandler />} />

          {/* ✅ Protect dashboard too */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
          <Route path="/list" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

// ✅ Wrap App with Router
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

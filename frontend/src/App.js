import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import ProtectedRoute from './utils/ProtectedRoute';
import { logout, isLoggedIn } from './utils/auth';

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
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
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

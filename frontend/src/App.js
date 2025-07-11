import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import ProtectedRoute from './utils/ProtectedRoute';
import { logout, isLoggedIn } from './utils/auth';

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* ✅ Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">Expense Tracker</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!isLoggedIn() ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">Signup</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/add">Add Expense</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/list">View Expenses</Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* ✅ Route Container */}
      <div className="container">
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

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

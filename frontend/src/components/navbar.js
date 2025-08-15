import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav
      className="navbar shadow-sm px-4 py-3 d-flex justify-content-between align-items-center"
      style={{
        backdropFilter: 'blur(12px)',
        background: 'rgba(255, 255, 255, 0.15)',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '0 0 20px 20px',
        fontFamily: "'Poppins', sans-serif",
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="d-flex align-items-center">
        <Link to="/" className="navbar-brand fw-bold fs-4 text-primary text-decoration-none">
          💸 ExpenseTracker
        </Link>
      </div>

      <div>
        {token ? (
          <>
            <Link to="/dashboard" className="btn btn-sm me-2 btn-outline-primary">
              Dashboard
            </Link>
            <Link to="/add-expense" className="btn btn-sm me-2 btn-outline-success">
              Add Expense
            </Link>
            <Link to="/expenses" className="btn btn-sm me-2 btn-outline-info">
              My Expenses
            </Link>
            <button onClick={handleLogout} className="btn btn-sm btn-danger">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm me-2 btn-primary text-white">
              Login
            </Link>
            <Link to="/signup" className="btn btn-sm btn-success text-white">
              Sign Up
            </Link>
          </>
        )}
      </div>

      <style>{`
        .btn-outline-primary {
          border-radius: 10px;
          transition: 0.3s;
        }
        .btn-outline-primary:hover {
          background: #0d6efd;
          color: white;
        }
        .btn-outline-success {
          border-radius: 10px;
          transition: 0.3s;
        }
        .btn-outline-success:hover {
          background: #198754;
          color: white;
        }
        .btn-outline-info {
          border-radius: 10px;
          transition: 0.3s;
        }
        .btn-outline-info:hover {
          background: #0dcaf0;
          color: white;
        }
        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;

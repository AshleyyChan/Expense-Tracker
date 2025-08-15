import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/dashboard/dashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import OAuthHandler from './pages/OAuthHandler';

// ✅ Layout wrapper for protected pages with navbar
function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="container mt-4 mb-5">{children}</div>
    </div>
  );
}

// ✅ Welcome / Landing page
function Welcome() {
  return (
    <div
      className="text-center"
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <h1 className="mb-4">💰 Welcome to Expense Tracker</h1>
      <p className="mb-4 text-muted">Track your expenses, visualize spending, and save smarter.</p>
      <div className="d-flex justify-content-center gap-3">
        <a className="btn btn-success btn-lg" href="/signup">Sign Up</a>
        <a className="btn btn-primary btn-lg" href="/login">Login</a>
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
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddExpense />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <Layout>
                <ExpenseList />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

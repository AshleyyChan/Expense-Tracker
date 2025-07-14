import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token); // ✅ Save token
      navigate('/add'); // ✅ Redirect to Add Expense
    } else {
      navigate('/login'); // If no token, redirect to login
    }
  }, [navigate]);

  return (
    <div className="text-center mt-5">
      <h4>Redirecting...</h4>
    </div>
  );
}

export default Dashboard;

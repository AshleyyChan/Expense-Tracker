import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get('token');

    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);
    }

    const token = tokenFromURL || localStorage.getItem('token');

    if (token) {
      navigate('/add'); // ✅ This is your dashboard page (Add Expense)
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="text-center mt-5">
      <h5>🔄 Redirecting to your dashboard...</h5>
    </div>
  );
}

export default Dashboard;

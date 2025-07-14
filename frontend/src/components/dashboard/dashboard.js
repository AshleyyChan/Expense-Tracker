import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/home'); // ✅ Redirect to a real dashboard route
    } else {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <div className="text-center mt-5">
      <h5>🔄 Redirecting to your dashboard...</h5>
    </div>
  );
}

export default Dashboard;

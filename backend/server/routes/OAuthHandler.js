// src/pages/OAuthHandler.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, '/dashboard');
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div className="container text-center mt-5">
      <h4>🔄 Logging you in with Google...</h4>
    </div>
  );
}

export default OAuthHandler;

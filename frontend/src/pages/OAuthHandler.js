import React, { useEffect } from 'react';

function OAuthHandler() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);

      // ✅ Hard reload to reset React Router + token logic
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="text-center mt-5">
      <h4>🔐 Finishing Google login...</h4>
    </div>
  );
}

export default OAuthHandler;

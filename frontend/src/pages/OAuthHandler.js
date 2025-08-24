import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // ✅ Save token to localStorage
      localStorage.setItem("token", token);

      // ✅ Let App.js know token changed (Navbar updates immediately)
      window.dispatchEvent(new Event("storage"));

      // ✅ Redirect using React Router (no full reload)
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="text-center mt-5">
      <h4>🔐 Finishing Google login...</h4>
    </div>
  );
}

export default OAuthHandler;

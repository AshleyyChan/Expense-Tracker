import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthHandler({ setToken }) {   // ✅ accept setToken from App
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // ✅ Save token
      localStorage.setItem("token", token);

      // ✅ Update React state so Navbar updates immediately
      setToken(token);

      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, setToken]);

  return (
    <div className="text-center mt-5">
      <h4>🔐 Finishing Google login...</h4>
    </div>
  );
}

export default OAuthHandler;

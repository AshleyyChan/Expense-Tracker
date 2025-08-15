import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, "/dashboard");
      navigate("/dashboard");
    } else {
      const localToken = localStorage.getItem("token");
      if (localToken) navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://expense-tracker-mvx1.onrender.com/api/auth/login",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://expense-tracker-mvx1.onrender.com/auth/google";
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="glass-card p-5 shadow-lg"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "20px",
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          animation: "fadeInUp 1s ease",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-white" style={{ textShadow: "1px 1px 8px rgba(0,0,0,0.3)" }}>
            Welcome Back
          </h2>
          <p className="text-white-50">Sign in to continue managing expenses</p>
        </div>

        {message && (
          <div
            className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}
            style={{ borderRadius: "10px", textAlign: "center" }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className="form-control form-control-lg glass-input"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              name="password"
              type="password"
              className="form-control form-control-lg glass-input"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-gradient w-100 text-white fw-bold"
            disabled={loading}
          >
            {loading ? "⏳ Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center my-3 text-white-50">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-google w-100 d-flex align-items-center justify-content-center fw-bold"
        >
          <img
            src="https://img.icons8.com/color/20/google-logo.png"
            alt="google"
            className="me-2"
          />
          Sign in with Google
        </button>

        <p className="mt-3 text-center text-white-50">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-decoration-none fw-bold text-warning">
            Sign Up
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px);}
          100% { opacity: 1; transform: translateY(0);}
        }

        .glass-input {
          border-radius: 12px;
          border: none;
          padding: 12px 15px;
          background: rgba(255,255,255,0.2);
          color: #fff;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .glass-input:focus {
          outline: none;
          background: rgba(255,255,255,0.35);
          box-shadow: 0 0 10px rgba(255,255,255,0.6);
        }

        .btn-gradient {
          border-radius: 12px;
          padding: 12px 0;
          background: linear-gradient(90deg, #ff8a00, #e52e71);
          font-weight: 600;
          transition: 0.3s;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .btn-google {
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.2);
          color: #fff;
          padding: 10px 0;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-google:hover {
          background: rgba(255,255,255,0.35);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .text-white-50 { color: rgba(255,255,255,0.7); }
      `}</style>
    </div>
  );
}

export default Login;

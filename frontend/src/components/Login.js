import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setToken }) {   // ✅ accept setToken from App
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://expense-tracker-mvx1.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // ✅ Save token
        localStorage.setItem("token", data.token);

        // ✅ Update React state so Navbar re-renders
        setToken(data.token);

        setMessage("✅ Login successful!");
        navigate("/dashboard", { replace: true });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Login failed");
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
      style={{
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        className="shadow-lg"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "20px",
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          padding: "40px",
          animation: "fadeInUp 1s ease",
        }}
      >
        <div className="text-center mb-4">
          <h2
            className="fw-bold text-white"
            style={{ textShadow: "1px 1px 8px rgba(0,0,0,0.3)" }}
          >
            Welcome Back
          </h2>
          <p className="text-white-50">
            Sign in to continue managing expenses
          </p>
        </div>

        {message && (
          <div
            className={`alert ${
              message.startsWith("✅") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="glass-input"
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="glass-input"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="btn-gradient"
            style={{ marginBottom: "10px" }}
            disabled={loading}
          >
            {loading ? "⏳ Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center my-3 text-white-50">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn-google fw-bold"
          style={{ marginBottom: "10px" }}
        >
          <img
            src="https://img.icons8.com/color/20/google-logo.png"
            alt="google"
            style={{ marginRight: "8px" }}
          />
          Sign in with Google
        </button>

        <p className="mt-3 text-center text-white-50">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-decoration-none fw-bold text-warning"
          >
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
          width: 100%;
          margin-bottom: 15px;
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
          width: 100%;
          color: #fff;
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
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
        }
        .btn-google:hover {
          background: rgba(255,255,255,0.35);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .text-white-50 { color: rgba(255,255,255,0.7); }
        .alert { border-radius: 10px; text-align: center; margin-bottom: 15px; }
      `}</style>
    </div>
  );
}

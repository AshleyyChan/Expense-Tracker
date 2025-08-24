import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://expense-tracker-mvx1.onrender.com/api/auth/signup",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Broadcast auth change so Navbar/ProtectedRoute update instantly
      window.dispatchEvent(new Event("storage"));

      setMessage("✅ Signup successful!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
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
            Create Account
          </h2>
          <p className="text-white-50">Sign up with email or Google</p>
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
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="glass-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="glass-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="glass-input"
            required
          />
          <button
            type="submit"
            className="btn-gradient"
            disabled={loading}
            style={{ marginBottom: "10px" }}
          >
            {loading ? "⏳ Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center my-3 text-white-50">OR</div>

        <button
          onClick={handleGoogleSignup}
          className="btn-google fw-bold"
          style={{ marginBottom: "10px" }}
        >
          <img
            src="https://img.icons8.com/color/20/google-logo.png"
            alt="Google"
            style={{ marginRight: "8px" }}
          />
          Sign Up with Google
        </button>

        <p className="mt-3 text-center text-white-50">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-decoration-none fw-bold text-warning"
          >
            Login
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

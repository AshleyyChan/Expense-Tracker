import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

      localStorage.setItem("token", res.data.token);
      setMessage("✅ Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Signup error:", err.response?.data || err.message);
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
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="card p-5 shadow-lg"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.95)",
          animation: "fadeIn 1s ease",
        }}
      >
        <div className="text-center mb-4">
          <h2 style={{ fontWeight: "700", color: "#333" }}>Create Account</h2>
          <p className="text-muted">Sign up with email or Google</p>
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
            name="username"
            className="form-control form-control-lg mb-3"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={{ borderRadius: "10px" }}
            required
          />
          <input
            name="email"
            type="email"
            className="form-control form-control-lg mb-3"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{ borderRadius: "10px" }}
            required
          />
          <input
            name="password"
            type="password"
            className="form-control form-control-lg mb-3"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{ borderRadius: "10px" }}
            required
          />

          <button
            type="submit"
            className="btn btn-gradient w-100 mb-3 text-white"
            style={{
              borderRadius: "10px",
              padding: "10px 0",
              background: "linear-gradient(90deg, #ff8a00, #e52e71)",
              fontWeight: "600",
            }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center my-3 text-muted">OR</div>

        <button
          onClick={handleGoogleSignup}
          className="btn w-100 d-flex align-items-center justify-content-center"
          style={{
            borderRadius: "10px",
            border: "1px solid #ddd",
            padding: "10px 0",
            background: "#fff",
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google logo"
            style={{ width: "20px", marginRight: "10px" }}
          />
          Sign Up with Google
        </button>

        <p className="mt-3 text-center text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none fw-bold text-primary">
            Login
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-20px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}

export default Signup;

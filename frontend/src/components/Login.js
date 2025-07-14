import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle Google OAuth token from URL
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
      className="container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">🔐 Login</h2>
        <p className="text-muted">Access your expenses securely</p>
      </div>

      <div
        className="card p-4 shadow-lg bg-white w-100"
        style={{ maxWidth: "420px", borderRadius: "12px" }}
      >
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
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <hr className="my-4" />

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
        >
          <img
            src="https://logos-world.net/wp-content/uploads/2020/09/Google-Symbol.png"
            alt="Google"
            style={{ width: "20px", height: "20px", marginRight: "10px" }}
          />
          Continue with Google
        </button>

        <p className="mt-3 text-center text-muted">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-decoration-none text-success">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

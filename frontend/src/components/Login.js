import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://expense-tracker-mvx1.onrender.com/api/auth/login', form, {
        headers: { 'Content-Type': 'application/json' }
      });

      localStorage.setItem('token', res.data.token);
      setMessage('✅ Login successful!');
      console.log('🪪 Token:', res.data.token);
      navigate('/list');
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || '❌ Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://expense-tracker-mvx1.onrender.com/auth/google';
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="text-center mb-4">
        <h2>🔐 Login to Your Account</h2>
        <p className="text-muted">Access your expenses securely</p>
      </div>

      <div className="card p-4 shadow-lg w-100 bg-light" style={{ maxWidth: '400px' }}>
        {message && (
          <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
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
            <label className="form-label d-flex justify-content-between">
              Password
              <Link to="/forgot-password" className="text-decoration-none small text-primary">Forgot?</Link>
            </label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <hr className="my-4" />

        <button onClick={handleGoogleLogin} className="btn btn-outline-danger w-100">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google logo"
            style={{ width: '20px', marginRight: '10px', verticalAlign: 'middle' }}
          />
          Login with Google
        </button>

        <p className="mt-3 text-center">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-decoration-none text-success">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

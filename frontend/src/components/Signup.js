import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('https://expense-tracker-mvx1.onrender.com/api/auth/signup', form, {
        headers: { 'Content-Type': 'application/json' }
      });

      setMessage('✅ Signup successful!');
      console.log('🪪 JWT Token:', res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      console.error('❌ Signup error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || '❌ Signup failed');
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'https://expense-tracker-mvx1.onrender.com/auth/google';
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="text-center mb-4">
        <h2>📝 Create Your Account</h2>
        <p className="text-muted">Sign up using email or Google</p>
      </div>

      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '400px' }}>
        {message && (
          <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              name="username"
              className="form-control"
              placeholder="JohnDoe"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

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
            <label className="form-label">Password</label>
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

          <button type="submit" className="btn btn-success w-100">
            Sign Up with Email
          </button>
        </form>

        <hr className="my-4" />

        <button onClick={handleGoogleSignup} className="btn btn-outline-danger w-100">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google logo"
            style={{ width: '20px', marginRight: '10px', verticalAlign: 'middle' }}
          />
          Sign Up with Google
        </button>
      </div>
    </div>
  );
}

export default Signup;

import React, { useState } from 'react';
import { loginUser } from '../../lib/authService';
import { useToast } from '../../contexts/ToastContext';

export default function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    const result = await loginUser(formData.email, formData.password);

    if (result.success) {
      showToast('Login successful!', 'success');
      if (onSuccess) onSuccess();
    } else {
      showToast(result.error, 'error');
    }
    
    setLoading(false);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
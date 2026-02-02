import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, User, Sparkles, Shield, Zap } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { success } = await login(credentials.username, credentials.password);
      if (success) {
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      {/* Login Card */}
      <div className="login-card">
        {/* Glow Effect */}
        <div className="card-glow"></div>

        {/* Header Section */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-ring">
              <Shield className="logo-icon" size={32} />
            </div>
            <div className="logo-pulse"></div>
          </div>
          <h1 className="login-title">
            <span className="title-gradient">AURORA</span>
            <Sparkles className="title-sparkle" size={20} />
          </h1>
          <p className="login-subtitle">Advanced Unified Resource Operations & Remote Access</p>
          <div className="status-badge">
            <div className="status-dot"></div>
            <span>System Online</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Username Field */}
          <div className={`input-wrapper ${focusedField === 'username' ? 'focused' : ''}`}>
            <label className="input-label">Username</label>
            <div className="input-container">
              <User className="input-icon" size={18} />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
                className="input-field"
                autoComplete="username"
                required
              />
              <div className="input-border"></div>
            </div>
          </div>

          {/* Password Field */}
          <div className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''}`}>
            <label className="input-label">Password</label>
            <div className="input-container">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
                className="input-field"
                autoComplete="current-password"
                required
              />
              <div className="input-border"></div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || !credentials.username || !credentials.password}
            className={`login-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                <span>Authenticating</span>
                <div className="loading-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </>
            ) : (
              <>
                <Zap size={18} />
                <span>Access System</span>
              </>
            )}
            <div className="button-shine"></div>
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <div className="security-badge">
            <Shield size={14} />
            <span>256-bit Encrypted Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

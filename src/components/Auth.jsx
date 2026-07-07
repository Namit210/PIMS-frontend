import { useState } from 'react';

const API_URL = 'http://localhost:3000';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || (!isLogin && !username)) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? '/users/login' : '/users/signup';
    const payload = isLogin 
      ? { email, password } 
      : { name: username, email, password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Success callback
      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <div className="auth-logo" style={{ background: "none", boxShadow: "none", width: "140px", height: "auto", borderRadius: "0" }}>
          <img src="/taskPlanet.png" alt="TaskPlanet Logo" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
        </div>
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p>{isLogin ? 'Sign in to manage your payments' : 'Create a new Payment Manager profile'}</p>
      </div>

      <div className="auth-card">
        {error && (
          <div className="error-banner">
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </span>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
            </div>
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
}

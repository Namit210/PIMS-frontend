import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineAlert } from 'react-icons/ai';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || (!isLogin && !username) || (!isLogin && isAdmin && !adminSecret)) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? '/users/login' : '/users/signup';
    const payload = isLogin 
      ? { email, password } 
      : { 
          name: username, 
          email, 
          password, 
          role: isAdmin ? 'admin' : 'user',
          adminSecret: isAdmin ? adminSecret : undefined 
        };

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

  // Inline styling overrides matching login.png layout
  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    padding: "24px",
    boxSizing: "border-box"
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    padding: "10px 0px"
  };

  const headingStyle = {
    fontSize: "30px",
    fontWeight: "800",
    color: "#4F00FF",
    textAlign: "center",
    marginBottom: "30px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontFamily: "Outfit, Inter, sans-serif"
  };

  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
    textAlign: "left"
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#2c2755",
    marginBottom: "8px",
    fontFamily: "Outfit, Inter, sans-serif"
  };

  const inputWrapperStyle = {
    position: "relative",
    width: "100%"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    fontSize: "14px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    outline: "none",
    color: "#1e1b24",
    transition: "border-color 0.2s"
  };

  const eyeIconStyle = {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "20px",
    color: "#1e1b24",
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  };

  const forgotStyle = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-8px",
    marginBottom: "24px"
  };

  const forgotLinkStyle = {
    fontSize: "13px",
    fontWeight: "700",
    color: "#FF4B00",
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "Outfit, Inter, sans-serif"
  };

  const submitBtnStyle = {
    width: "100%",
    backgroundColor: "#4F00FF",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "10px",
    fontFamily: "Outfit, Inter, sans-serif"
  };

  const footerStyle = {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "14px",
    color: "#000000",
    fontWeight: "500",
    fontFamily: "Outfit, Inter, sans-serif"
  };

  const footerLinkStyle = {
    color: "#4F00FF",
    fontWeight: "700",
    cursor: "pointer",
    marginLeft: "6px",
    textDecoration: "none"
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        
        {/* Header Heading matching login.png */}
        <h2 style={headingStyle}>{isLogin ? 'Login' : 'Register'}</h2>

        {/* Error notification banner */}
        {error && (
          <div className="error-banner" style={{ marginBottom: "20px" }}>
            <AiOutlineAlert style={{ fontSize: "16px", flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Full Name input for Signup only */}
          {!isLogin && (
            <div style={formGroupStyle}>
              <label htmlFor="username" style={labelStyle}>Full Name</label>
              <div style={inputWrapperStyle}>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter Your Full Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={inputStyle}
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address input */}
          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>Username Or Email</label>
            <div style={inputWrapperStyle}>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter Your Username Or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password input with Eye toggle visibility */}
          <div style={formGroupStyle}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <div style={inputWrapperStyle}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "44px" }}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
              <span 
                style={eyeIconStyle} 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>


          {/* Admin checkbox toggle for registration */}
          {!isLogin && (
            <div style={{ ...formGroupStyle, flexDirection: "row", alignItems: "center", gap: "8px", marginTop: "-4px" }}>
              <input
                id="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => {
                  setIsAdmin(e.target.checked);
                  if(!e.target.checked) setAdminSecret('');
                }}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label htmlFor="isAdmin" style={{ cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#64748b", margin: 0 }}>
                Register as Admin
              </label>
            </div>
          )}

          {/* Admin Secret Key input */}
          {!isLogin && isAdmin && (
            <div style={formGroupStyle}>
              <label htmlFor="adminSecret" style={labelStyle}>Admin Secret Key</label>
              <div style={inputWrapperStyle}>
                <input
                  id="adminSecret"
                  type="password"
                  name="adminSecret"
                  placeholder="Enter Admin Secret Key"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button 
            style={submitBtnStyle} 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Footer Toggle links matching login.png */}
        <div style={footerStyle}>
          {isLogin ? "Need An Account?" : "Already have an account?"}
          <span 
            onClick={() => {
              setIsLogin(!isLogin);
              setIsAdmin(false);
              setAdminSecret('');
              setError('');
            }}
            style={footerLinkStyle}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </div>
      </div>
    </div>
  );
}

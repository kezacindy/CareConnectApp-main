import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification/Notification';
import '../styles/pages.css';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    show: false
  });

  const showNotification = (message, type) => {
    setNotification({
      message,
      type,
      show: true
    });
  };

  const closeNotification = () => {
    setNotification({
      message: '',
      type: '',
      show: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        showNotification('Login successful! OTP sent to your email', 'success');
        setTimeout(() => {
          navigate('/verify-otp', { state: { email } });
        }, 2000);
      } else {
        showNotification('Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      showNotification('An error occurred. Please try again later.', 'error');
    }
  };

  return (
    <div className="auth-container">
      <Navbar />
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      
      <div className="container min-vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100">
          {/* Left Side - Image Section */}
          <div className="col-md-6 d-none d-md-flex align-items-center">
            <div className="info-section w-100">
              <div className="text-center mb-4">
                <i className="fas fa-heartbeat fa-4x mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}></i>
              </div>
              <h2 className="h1 mb-4">Welcome Back!</h2>
              <p className="lead mb-4">
                Reconnect with your healthcare journey. 
                Seamless, secure, and always at your fingertips.
              </p>
              <div className="row text-center">
                <div className="col-4">
                  <i className="fas fa-shield-alt fa-2x mb-2"></i>
                  <p className="small">Secure</p>
                </div>
                <div className="col-4">
                  <i className="fas fa-clock fa-2x mb-2"></i>
                  <p className="small">24/7</p>
                </div>
                <div className="col-4">
                  <i className="fas fa-user-md fa-2x mb-2"></i>
                  <p className="small">Expert Care</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="auth-form-wrapper animate-fadeInUp">
              <div className="text-center mb-4">
                <div className="mb-4">
                  <i className="fas fa-user-circle fa-4x" style={{ color: 'var(--primary-color)' }}></i>
                </div>
                <h2 className="section-title h3">Login to CareConnect</h2>
                <p className="text-muted">Access your personalized healthcare platform</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">Email address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between mb-4">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="remember" />
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                  <a href="/forgot-password" className="text-primary text-decoration-none">
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" className="btn btn-gradient w-100 mb-4">
                  Login
                </button>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account? {' '}
                    <a href="/register" className="text-primary text-decoration-none">
                      Create Account
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

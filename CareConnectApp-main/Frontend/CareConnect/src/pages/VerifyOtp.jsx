import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './VerifyOtp.css';
import { useAuth } from '../context/AuthContext';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    setOtp(value);
    setError('');
  };

  const handleVerify = async () => {
    if (otp.length !== 8) {
      setError('Please enter all 8 characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: location.state?.email,
          otp: otp
        })
      });

      const data = await response.json();

      if (response.ok) {
        const success = await login(data);
        if (success) {
          handleSuccess(data);
        } else {
          setError('Failed to process login data');
        }
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed. Please try again.');
    }
  };

  const handleSuccess = async (data) => {
    const success = await login(data);
    if (success) {
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else if (data.user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else if (data.user.role === 'PATIENT') {
        navigate('/patient/dashboard');
      }
    }
  };

  return (
    <div className="verify-otp-page">
      <Navbar />
      <div className="verify-otp-container">
        <div className="verify-otp-card">
          <div className="verify-otp-header">
            <h2>Verify Your Email</h2>
            <p>
              We've sent a verification code to<br />
              <strong>{location.state?.email}</strong>
            </p>
          </div>

          <div className="otp-input-container">
            <input
              type="text"
              value={otp}
              onChange={handleInputChange}
              placeholder="Enter verification code"
              maxLength={8}
              className={error ? 'error' : ''}
              autoComplete="off"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            className="verify-button"
            onClick={handleVerify}
            disabled={otp.length !== 8}
          >
            {otp.length === 8 ? 'Verify Email' : 'Enter Complete Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
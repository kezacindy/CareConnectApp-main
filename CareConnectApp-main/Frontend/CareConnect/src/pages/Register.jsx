import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification/Notification';
import '../styles/pages.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'PATIENT'
  });

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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add password validation
    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/accounts/createAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification('Account created successfully!', 'success');
        // Reset form after successful registration
        setFormData({
          name: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          username: '',
          password: '',
          confirmPassword: '',
          role: 'PATIENT'
        });
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Error creating account', 'error');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      showNotification('An error occurred while creating your account', 'error');
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
      
      <div className="container min-vh-100 d-flex align-items-center">
        <div className="row w-100">
          {/* Left Side - Registration Form */}
          <div className="col-md-6">
            <div className="auth-form-wrapper animate-fadeInUp">
              <div className="text-center mb-4">
                <div className="mb-4">
                  <i className="fas fa-user-plus fa-4x" style={{ color: 'var(--primary-color)' }}></i>
                </div>
                <h2 className="section-title h3">Create Your Account</h2>
                <p className="text-muted">Join CareConnect Healthcare Platform</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name" 
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-phone"></i>
                    </span>
                    <input 
                      type="tel" 
                      className="form-control" 
                      id="phone" 
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Date of Birth</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-calendar"></i>
                    </span>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Gender</label>
                  <select className="form-select" id="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-map-marker-alt"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="address" 
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Username</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user-tag"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="username" 
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Email address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
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
                      id="password" 
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="confirmPassword" 
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Account Type</label>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input 
                        type="radio" 
                        className="form-check-input" 
                        id="patientType"
                        name="role"
                        value="PATIENT"
                        checked={formData.role === 'PATIENT'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="patientType">
                        Patient
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        type="radio" 
                        className="form-check-input" 
                        id="doctorType"
                        name="role"
                        value="DOCTOR"
                        checked={formData.role === 'DOCTOR'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="doctorType">
                        Doctor
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4 form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="termsCheck"
                    required
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    I agree to the Terms and Conditions
                  </label>
                </div>

                <button type="submit" className="btn btn-gradient w-100 mb-4">
                  Create Account
                </button>

                <div className="text-center">
                  <p className="mb-4">
                    Already have an account? {' '}
                    <a href="/login" className="text-primary text-decoration-none">
                      Login
                    </a>
                  </p>

                  <div className="text-muted mb-4">Or register with</div>
                  
                  <div className="d-flex justify-content-center gap-3">
                    <button type="button" className="btn btn-outline-secondary rounded-circle">
                      <i className="fab fa-google"></i>
                    </button>
                    <button type="button" className="btn btn-outline-secondary rounded-circle">
                      <i className="fab fa-facebook-f"></i>
                    </button>
                    <button type="button" className="btn btn-outline-secondary rounded-circle">
                      <i className="fab fa-apple"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Benefits Section */}
          <div className="col-md-6 d-none d-md-flex align-items-center">
            <div className="info-section w-100">
              <div className="text-center mb-4">
                <i className="fas fa-star fa-4x mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}></i>
              </div>
              <h2 className="h1 mb-4">Why Join CareConnect?</h2>
              <ul className="list-unstyled mb-4">
                <li className="mb-3 d-flex align-items-center">
                  <i className="fas fa-check-circle me-3 fa-lg"></i>
                  <span>Convenient Online Consultations</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="fas fa-check-circle me-3 fa-lg"></i>
                  <span>Secure and Private Healthcare</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="fas fa-check-circle me-3 fa-lg"></i>
                  <span>Access to Top Medical Professionals</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="fas fa-check-circle me-3 fa-lg"></i>
                  <span>Personalized Health Tracking</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="fas fa-check-circle me-3 fa-lg"></i>
                  <span>24/7 Medical Support</span>
                </li>
              </ul>
              <div className="mt-4 text-center">
                <div className="row">
                  <div className="col-4">
                    <i className="fas fa-users fa-2x mb-2"></i>
                    <p className="small">10K+ Users</p>
                  </div>
                  <div className="col-4">
                    <i className="fas fa-award fa-2x mb-2"></i>
                    <p className="small">Trusted</p>
                  </div>
                  <div className="col-4">
                    <i className="fas fa-globe fa-2x mb-2"></i>
                    <p className="small">Global</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

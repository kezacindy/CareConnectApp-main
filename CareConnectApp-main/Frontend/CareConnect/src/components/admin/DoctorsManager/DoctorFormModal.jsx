import React, { useState, useEffect } from 'react';
import styles from './DoctorFormModal.module.css';
import Notification from '../../Notification/Notification';

const DoctorFormModal = ({ doctor, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    specialization: '',
    phone: '',
    experience: '',
    licenseNumber: '',
    role: 'DOCTOR'
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ''
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        username: doctor.username || '',
        password: '', // Don't populate password for editing
        email: doctor.email || '',
        specialization: doctor.specialization || '',
        phone: doctor.phone || '',
        experience: doctor.experience || '',
        licenseNumber: doctor.licenseNumber || '',
        role: 'DOCTOR'
      });
    }
  }, [doctor]);

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!doctor && !formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (doctor) {
          onSubmit(formData);
        } else {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/doctor/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register doctor');
          }

          const data = await response.json();
          onSubmit(data);
          setNotification({
            show: true,
            message: 'Doctor registered successfully!',
            type: 'success'
          });
          setTimeout(() => {
            onClose(); // Close the modal after showing success message
          }, 2000);
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Failed to register doctor'
        }));
        setNotification({
          show: true,
          message: error.message || 'Failed to register doctor',
          type: 'error'
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{doctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? styles.errorInput : ''}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="username">Username*</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? styles.errorInput : ''}
              />
              {errors.username && <span className={styles.errorText}>{errors.username}</span>}
            </div>

            {!doctor && (
              <div className={styles.formGroup}>
                <label htmlFor="password">Password*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? styles.errorInput : ''}
                />
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.errorInput : ''}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="specialization">Specialization*</label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={errors.specialization ? styles.errorInput : ''}
              >
                <option value="">Select Specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              {errors.specialization && <span className={styles.errorText}>{errors.specialization}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number*</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? styles.errorInput : ''}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="experience">Experience (years)*</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                className={errors.experience ? styles.errorInput : ''}
              />
              {errors.experience && <span className={styles.errorText}>{errors.experience}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="licenseNumber">License Number*</label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className={errors.licenseNumber ? styles.errorInput : ''}
              />
              {errors.licenseNumber && <span className={styles.errorText}>{errors.licenseNumber}</span>}
            </div>
          </div>

          {/* Add error message display for API errors */}
          {errors.submit && (
            <div className={styles.submitError}>
              {errors.submit}
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {doctor ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorFormModal; 
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaVenusMars, FaEdit } from 'react-icons/fa';
import '../../styles/dashboard.css';

const Settings = () => {
  const { patientInfo, updatePatientInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patientInfo?.name || '',
    email: patientInfo?.email || '',
    phone: patientInfo?.phone || '',
    dateOfBirth: patientInfo?.dateOfBirth || '',
    address: patientInfo?.address || '',
    gender: patientInfo?.gender || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/patients/${patientInfo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedPatient = await response.json();
        updatePatientInfo(updatedPatient);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error updating profile');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-card">
        <div className="settings-header">
          <h2 className="section-title">Profile Settings</h2>
          {!isEditing && (
            <button 
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit className="edit-icon" />
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaUser className="form-icon" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>
                <FaEnvelope className="form-icon" />
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaPhone className="form-icon" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>
                <FaCalendar className="form-icon" />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                className="form-control"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaMapMarkerAlt className="form-icon" />
                Address
              </label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>
                <FaVenusMars className="form-icon" />
                Gender
              </label>
              <select
                name="gender"
                className="form-control"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <div className="button-group">
              <button type="submit" className="btn-dashboard btn-primary">
                Save Changes
              </button>
              <button 
                type="button" 
                className="btn-dashboard btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Settings;

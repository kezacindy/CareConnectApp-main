import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';
import './AppointmentList.css';
import Notification from '../Notification/Notification';
import ConfirmationModal from '../Modal/ConfirmationModal';
import { FaCalendarPlus, FaUserMd, FaClock, FaRegCalendarCheck } from 'react-icons/fa';

// Mock data for specialties
const specialties = [
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'dermatology', name: 'Dermatology' },
  { id: 'neurology', name: 'Neurology' },
  { id: 'oncology', name: 'Oncology' },
  { id: 'ophthalmology', name: 'Ophthalmology' },
  { id: 'orthopedics', name: 'Orthopedics' },
  { id: 'pediatrics', name: 'Pediatrics' },
  { id: 'psychiatry', name: 'Psychiatry' }
];

const AppointmentList = () => {
  const { user, patientInfo, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
  });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    appointmentId: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Only allow patients to access this component
    if (user?.role !== 'PATIENT') {
      navigate('/unauthorized');
      return;
    }

    if (!patientInfo) {
      showNotification('Patient information not found', 'error');
      return;
    }

    fetchPatientAppointments();
  }, [isAuthenticated, user, patientInfo]);

  // Add a function to fetch doctor's appointments
  const fetchDoctorAppointments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/doctor/${user.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      const formattedAppointments = data.map(apt => ({
        id: apt.id,
        date: apt.date,
        time: apt.time,
        patient: apt.patient?.name || 'Unknown Patient',
        status: apt.status
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      showNotification('Failed to load appointments', 'error');
    }
  };

  // Update useEffect to fetch doctors from API when specialty changes
  useEffect(() => {
    const fetchDoctors = async () => {
      if (selectedSpecialty) {
        try {
          // Capitalize first letter of specialty for API endpoint
          const capitalizedSpecialty = selectedSpecialty.charAt(0).toUpperCase() + selectedSpecialty.slice(1);
          const response = await fetch(`http://localhost:8080/api/doctors/specialization/${capitalizedSpecialty}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch doctors');
          }
          
          const data = await response.json();
          setAvailableDoctors(data); // Assuming the API returns an array of doctor objects
          setSelectedDoctor('');
        } catch (error) {
          console.error('Error fetching doctors:', error);
          setAvailableDoctors([]);
          setSelectedDoctor('');
        }
      }
    };

    fetchDoctors();
  }, [selectedSpecialty]);

  // Create a reusable function for fetching appointments
  const fetchPatientAppointments = async () => {
    if (!patientInfo) return;

    try {
      const response = await fetch(`http://localhost:8080/api/appointments/patient/${patientInfo.id}`);
      if (!response.ok) throw new Error('Failed to fetch appointments');

      const data = await response.json();
      console.log('Raw appointment data:', data);

      // Let's check the structure of a single appointment
      if (data.length > 0) {
        console.log('First appointment structure:', data[0]);
        console.log('Doctor info in first appointment:', data[0].doctor);
      }

      const formattedAppointments = data.map(apt => {
        console.log('Processing appointment:', apt);
        return {
          id: apt.id,
          date: apt.date,
          time: apt.time,
          doctor: apt.doctor?.name || `Doctor ID: ${apt.doctor_id}`,
          status: apt.status
        };
      });

      console.log('Formatted appointments:', formattedAppointments);
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showNotification('Failed to load appointments', 'error');
    }
  };

  // Use it in useEffect
  useEffect(() => {
    fetchPatientAppointments();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // First, let's modify the setupAppointmentEdit function (previously handleUpdateAppointment)
  const setupAppointmentEdit = (appointment) => {
    const doctorObj = availableDoctors.find(doc => doc.name === appointment.doctor);
    setSelectedSpecialty(doctorObj?.specialization?.toLowerCase() || '');
    setSelectedDoctor(appointment.doctor);
    setFormData({
      date: appointment.date,
      time: appointment.time,
    });
    setEditingAppointment(appointment.id);
  };

  // Separate update function
  const handleUpdateAppointment = async () => {
    if (!patientInfo) {
      showNotification('Patient information not found', 'error');
      return;
    }

    if (!formData.date || !formData.time || !selectedDoctor) {
      showNotification('Please fill all fields and select a doctor.', 'error');
      return;
    }

    try {
      const selectedDoctorObj = availableDoctors.find(doc => doc.name === selectedDoctor);
      
      const appointmentData = {
        date: formData.date,
        time: formData.time,
        patient: {
          id: patientInfo.id
        },
        doctor: {
          id: selectedDoctorObj?.id
        },
        status: 'SCHEDULED'
      };

      const response = await fetch(`http://localhost:8080/api/appointments/${editingAppointment}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const responseText = await response.text();
      let updatedAppointment;
      try {
        updatedAppointment = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', responseText);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(`Failed to update appointment: ${responseText}`);
      }

      // Update the appointments list
      setAppointments(appointments.map(apt => 
        apt.id === editingAppointment ? {
          id: updatedAppointment.id,
          date: formData.date,
          time: formData.time,
          status: updatedAppointment.status,
          doctor: selectedDoctor
        } : apt
      ));

      // Reset form and editing state
      setFormData({ date: '', time: '' });
      setSelectedDoctor('');
      setSelectedSpecialty('');
      setEditingAppointment(null);

      showNotification('Appointment updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating appointment:', error);
      showNotification('Failed to update appointment. Please try again.', 'error');
    }
  };

  // Handle appointment booking or update
  const handleBookAppointment = async () => {
    if (!patientInfo) {
      showNotification('Patient information not found', 'error');
      return;
    }

    if (!formData.date || !formData.time || !selectedDoctor) {
      showNotification('Please fill all fields and select a doctor', 'error');
      return;
    }

    try {
      const selectedDoctorObj = availableDoctors.find(doc => doc.name === selectedDoctor);
      
      const appointmentData = {
        date: formData.date,
        time: formData.time,
        status: 'SCHEDULED'
      };

      const url = `http://localhost:8080/api/appointments?patientId=${encodeURIComponent(patientInfo.id)}&doctorId=${encodeURIComponent(selectedDoctorObj?.id)}`;

      console.log('Request URL:', url);
      console.log('Appointment Data being sent:', appointmentData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      // First try to get the response as text
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let newAppointment;
      try {
        // Then try to parse it as JSON
        newAppointment = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(`Failed to book appointment: ${responseText}`);
      }

      // Fetch updated list instead of manually updating state
      await fetchPatientAppointments();

      // Reset form
      setFormData({ date: '', time: '' });
      setSelectedDoctor('');
      setSelectedSpecialty('');

      showNotification('Appointment booked successfully!', 'success');
    } catch (error) {
      console.error('Error booking appointment:', error);
      showNotification('Failed to book appointment', 'error');
    }
  };

  // Handle appointment deletion
  const handleDeleteAppointment = async (id) => {
    setConfirmModal({
      isOpen: true,
      appointmentId: id
    });
  };

  // Add this new function to handle the actual deletion
  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${confirmModal.appointmentId}`, 
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete appointment');
      }

      // Refresh appointments list after successful deletion
      await fetchPatientAppointments();
      showNotification('Appointment deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showNotification('Failed to delete appointment. Please try again.', 'error');
    } finally {
      // Close the modal after deletion (whether successful or not)
      setConfirmModal({ isOpen: false, appointmentId: null });
    }
  };

  // Add this helper function to show notifications
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const loadUserData = async () => {
    try {
      const endpoint = user?.role === 'DOCTOR' 
        ? `/api/doctors/user/${user.id}`
        : `/api/patients/user/${user.id}`;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-card">
        <h2 className="section-title">Book an Appointment</h2>
        <div className="appointment-form">
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaUserMd className="form-icon" />
                Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="form-control"
              >
                <option value="">--Select Specialty--</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaUserMd className="form-icon" />
                Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                disabled={!availableDoctors.length}
                className="form-control"
              >
                <option value="">--Select Doctor--</option>
                {availableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaRegCalendarCheck className="form-icon" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>
                <FaClock className="form-icon" />
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>

          <button 
            onClick={editingAppointment ? handleUpdateAppointment : handleBookAppointment}
            className="btn-dashboard btn-primary"
          >
            <FaCalendarPlus />
            {editingAppointment ? 'Update Appointment' : 'Book Appointment'}
          </button>
        </div>
      </div>

      <div className="dashboard-card mt-4">
        <h2 className="section-title">Your Appointments</h2>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="text-dark">{appointment.date}</td>
                  <td className="text-dark">{appointment.time}</td>
                  <td className="text-dark">{appointment.doctor}</td>
                  <td>
                    <span className={`status-badge status-${appointment.status?.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-dashboard btn-primary btn-sm"
                        onClick={() => setupAppointmentEdit(appointment)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-dashboard btn-danger btn-sm"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        message="Are you sure you want to cancel this appointment?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, appointmentId: null })}
      />
    </div>
  );
};

export default AppointmentList;
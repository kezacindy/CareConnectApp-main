import React, { useState, useEffect } from 'react';
import '../../styles/dashboard.css';
import './DoctorTestResults.module.css';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../Notification/Notification';

const DoctorTestResults = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [newTest, setNewTest] = useState({
    testName: '',
    result: '',
    notes: ''
  });
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    show: false
  });
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (searchTerm) => {
    console.log('Searching:', searchTerm);
  };

  const handleFilter = (filterValue) => {
    console.log('Filtering:', filterValue);
  };

  const handleViewDetails = (testId) => {
    console.log('Viewing test:', testId);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'DOCTOR') {
      navigate('/unauthorized');
      return;
    }

    const fetchDoctorDataAndAppointments = async () => {
      try {
        const doctorResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/doctors/user/${user.id}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (!doctorResponse.ok) {
          throw new Error('Failed to fetch doctor data');
        }

        const doctorDetails = await doctorResponse.json();
        setDoctorData(doctorDetails);

        const appointmentsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/appointments/doctor/${doctorDetails.id}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (!appointmentsResponse.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);

        const uniquePatients = [...new Map(
          appointmentsData.map(apt => [
            apt.patient.id,
            {
              id: apt.patient.id,
              name: apt.patient.name,
              email: apt.patient.email
            }
          ])
        ).values()];
        
        setPatients(uniquePatients);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDataAndAppointments();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (selectedPatient) {
      const patientAppointments = appointments.filter(
        apt => apt.patient.id === selectedPatient
      );
      setFilteredAppointments(patientAppointments);
    } else {
      setFilteredAppointments([]);
    }
  }, [selectedPatient, appointments]);

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
    if (!selectedAppointment) {
      showNotification('Please select an appointment', 'error');
      return;
    }

    try {
      const requestBody = {
        testName: newTest.testName,
        result: newTest.result,
        appointment: {
          id: selectedAppointment
        },
        status: newTest.testType
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/test-results/saveTestResult`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add test result');
      }

      showNotification('Test result saved successfully!', 'success');
      setNewTest({
        testName: '',
        result: '',
        testType: 'PENDING'
      });
      setSelectedAppointment('');
    } catch (error) {
      console.error('Error saving test result:', error);
      showNotification(error.message || 'Error saving test result', 'error');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="animate-fade-in">
      <div className="dashboard-card">
        {notification.show && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}

        <div className="card-header">
          <div>
            <h1 className="section-title">Test Results Management</h1>
            <p className="text-muted">Manage and track patient test results</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-dashboard btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <FaPlus />
              Add New Test Result
            </button>
          </div>
        </div>

        <div className="doctor-info mb-4">
          <h3>Dr. {doctorData?.name || 'Loading...'}</h3>
          <p>Specialization: {doctorData?.specialization || 'Loading...'}</p>
        </div>

        {showAddForm && (
          <div className="test-form-section">
            <h2 className="form-section-title">Add New Test Result</h2>
            <form onSubmit={handleSubmit} className="test-result-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Patient</label>
                  <select
                    name="patient"
                    value={selectedPatient}
                    onChange={(e) => {
                      setSelectedPatient(e.target.value);
                      setSelectedAppointment('');
                    }}
                    className="form-control"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPatient && (
                  <div className="form-group">
                    <label>Appointment</label>
                    <select
                      name="appointment"
                      value={selectedAppointment}
                      onChange={(e) => setSelectedAppointment(e.target.value)}
                      className="form-control"
                      required
                    >
                      <option value="">Select Appointment</option>
                      {filteredAppointments.map((apt) => (
                        <option key={apt.id} value={apt.id}>
                          {new Date(apt.date).toLocaleDateString()} - {apt.time}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Test Name</label>
                  <input
                    type="text"
                    name="testName"
                    value={newTest.testName}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter test name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Result</label>
                  <input
                    type="text"
                    name="result"
                    value={newTest.result}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter test result"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={newTest.notes}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  placeholder="Add any additional notes"
                />
              </div>

              <div className="button-group">
                <button type="submit" className="btn-dashboard btn-primary">
                  Save Test Result
                </button>
                <button 
                  type="button" 
                  className="btn-dashboard btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="test-results-section mt-4">
          <div className="section-header">
            <h2 className="section-title">Test Results History</h2>
            <div className="search-filter">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search test results..."
                  className="search-input"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient Name</th>
                  <th>Test Name</th>
                  <th>Result</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((test) => (
                  <tr key={test.id}>
                    <td className="text-dark">
                      {new Date(test.testDate).toLocaleDateString()}
                    </td>
                    <td className="text-dark">{test.patient?.name}</td>
                    <td className="text-dark">{test.testName}</td>
                    <td className="text-dark">{test.result}</td>
                    <td className="text-dark text-truncate">{test.notes}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-dashboard btn-primary btn-sm"
                          onClick={() => handleViewDetails(test.id)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {testResults.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No test results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorTestResults;
import React, { useState, useEffect } from 'react';
import '../../styles/dashboard.css';
import './DoctorMedicalRecords.module.css';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../Notification/Notification';

const DoctorMedicalRecords = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRecord, setNewRecord] = useState({
    condition: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  });
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    show: false
  });

  // Add notification handlers
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

  // First, fetch doctor details and then get their appointments
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'DOCTOR') {
      navigate('/unauthorized');
      return;
    }

    const fetchDoctorDataAndPatients = async () => {
      try {
        // First fetch doctor's details using the user ID
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

        // Fetch scheduled patients directly using the new endpoint
        const scheduledPatientsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/appointments/doctor/${doctorDetails.id}/scheduled-patients`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (!scheduledPatientsResponse.ok) {
          throw new Error('Failed to fetch scheduled patients');
        }

        const scheduledPatients = await scheduledPatientsResponse.json();
        
        // Map the patients directly since they're already unique from the backend
        const formattedPatients = scheduledPatients.map(patient => ({
          id: patient.id,
          name: patient.name,
          email: patient.email
        }));
        
        setPatients(formattedPatients);
      } catch (error) {
        console.error('Error fetching data:', error);
        showNotification(error.message || 'Error fetching data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDataAndPatients();
  }, [isAuthenticated, user, navigate]);

  // Fetch medical records when doctorData is available
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      if (!doctorData?.id) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/medicalrecords/doctor/${doctorData.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch medical records');
        }

        const records = await response.json();
        setMedicalRecords(records);
      } catch (error) {
        console.error('Error fetching medical records:', error);
        showNotification(error.message || 'Error fetching medical records', 'error');
      }
    };

    fetchMedicalRecords();
  }, [doctorData]);

  // Update handleSubmit to use notifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !doctorData?.id) {
      showNotification('Please select a patient', 'error');
      return;
    }

    try {
      const requestBody = {
        condition: newRecord.condition,
        treatment: newRecord.treatment,
        notes: newRecord.notes,
        recordDate: new Date().toISOString(),
        patient: {
          id: selectedPatient
        },
        doctor: {
          id: doctorData.id
        },
        diagnosisType: newRecord.diagnosis
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/medicalrecords/saveRecords`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add medical record');
      }

      const savedRecord = await response.json();
      
      // Format the record to match the table structure
      const formattedRecord = {
        id: savedRecord.id,
        recordDate: savedRecord.recordDate,
        patient: {
          name: patients.find(p => p.id === selectedPatient)?.name
        },
        condition: savedRecord.condition,
        diagnosisType: savedRecord.diagnosisType,
        treatment: savedRecord.treatment,
        notes: savedRecord.notes
      };

      // Update the records list
      setMedicalRecords(prevRecords => 
        Array.isArray(prevRecords) 
          ? [...prevRecords, formattedRecord] 
          : [formattedRecord]
      );
      
      showNotification('Medical record saved successfully!', 'success');
      
      // Reset form
      setNewRecord({
        condition: '',
        diagnosis: '',
        treatment: '',
        notes: ''
      });
      setSelectedPatient('');

    } catch (error) {
      console.error('Error adding medical record:', error);
      showNotification(error.message || 'Error saving medical record', 'error');
    }
  };

  if (loading) return <div>Loading...</div>;

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
            <h1 className="section-title">Medical Records Management</h1>
            <p className="text-muted">Create and manage patient medical records</p>
          </div>
        </div>

        <div className="doctor-info mb-4">
          <h3>Dr. {doctorData?.name || 'Loading...'}</h3>
          <p>Specialization: {doctorData?.specialization || 'Loading...'}</p>
        </div>

        <div className="record-form-section">
          <h2 className="form-section-title">Add New Medical Record</h2>
          <form onSubmit={handleSubmit} className="medical-record-form">
            <div className="form-row">
              <div className="form-group">
                <label>Patient</label>
                <select
                  name="patient"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
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

              <div className="form-group">
                <label>Condition</label>
                <input
                  type="text"
                  name="condition"
                  value={newRecord.condition}
                  onChange={(e) => setNewRecord({...newRecord, condition: e.target.value})}
                  className="form-control"
                  placeholder="Enter patient's condition"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Diagnosis Type</label>
                <select
                  name="diagnosisType"
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                  className="form-control"
                  required
                >
                  <option value="">Select Diagnosis Type</option>
                  <option value="GENERAL">General - Common health concerns</option>
                  <option value="CHRONIC">Chronic - Long-term conditions</option>
                  <option value="ACUTE">Acute - Short-term urgent conditions</option>
                  <option value="PREVENTIVE">Preventive - Preventive care</option>
                </select>
              </div>

              <div className="form-group">
                <label>Treatment</label>
                <input
                  type="text"
                  name="treatment"
                  value={newRecord.treatment}
                  onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
                  className="form-control"
                  placeholder="Enter treatment details"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                className="form-control"
                rows="3"
                placeholder="Add any additional notes"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn-dashboard btn-primary">
                <FaPlus className="icon" />
                Add Medical Record
              </button>
            </div>
          </form>
        </div>

        <div className="records-history-section mt-4">
          <h2 className="section-title">Medical Records History</h2>
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient Name</th>
                  <th>Condition</th>
                  <th>Diagnosis</th>
                  <th>Treatment</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {medicalRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="text-dark">
                      {new Date(record.recordDate).toLocaleDateString()}
                    </td>
                    <td className="text-dark">{record.patient?.name}</td>
                    <td className="text-dark">{record.condition}</td>
                    <td className="text-dark">{record.diagnosisType}</td>
                    <td className="text-dark">{record.treatment}</td>
                    <td className="text-dark text-truncate">{record.notes}</td>
                  </tr>
                ))}
                {medicalRecords.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No medical records found
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

export default DoctorMedicalRecords;
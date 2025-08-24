import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PatientRecords.module.css';

const PatientRecords = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);

  // Mock data - replace with API calls
  useEffect(() => {
    // Simulate API call
    setPatient({
      id: patientId,
      name: 'John Smith',
      age: 35,
      gender: 'Male',
      bloodType: 'A+',
      assignedDoctor: 'Dr. Lucas Smith'
    });

    setRecords([
      {
        id: 1,
        date: '2024-03-10',
        type: 'Consultation',
        doctor: 'Dr. Lucas Smith',
        diagnosis: 'Common Cold',
        prescription: 'Paracetamol 500mg',
        notes: 'Patient showing improvement'
      },
      // Add more mock records
    ]);
  }, [patientId]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={() => navigate('/admin/patients')}
        >
          <ArrowLeftIcon />
          Back to Patients
        </button>
        <h1>Patient Records</h1>
      </div>

      <div className={styles.patientInfo}>
        <h2>{patient.name}</h2>
        <div className={styles.patientDetails}>
          <div>Age: {patient.age}</div>
          <div>Gender: {patient.gender}</div>
          <div>Blood Type: {patient.bloodType}</div>
          <div>Doctor: {patient.assignedDoctor}</div>
        </div>
      </div>

      <div className={styles.recordsSection}>
        <div className={styles.recordsHeader}>
          <h3>Medical Records</h3>
          <button className={styles.addButton}>
            <PlusIcon /> Add Record
          </button>
        </div>

        <div className={styles.recordsList}>
          {records.map(record => (
            <div key={record.id} className={styles.recordCard}>
              <div className={styles.recordHeader}>
                <div className={styles.recordDate}>{record.date}</div>
                <div className={styles.recordType}>{record.type}</div>
              </div>
              <div className={styles.recordBody}>
                <div><strong>Doctor:</strong> {record.doctor}</div>
                <div><strong>Diagnosis:</strong> {record.diagnosis}</div>
                <div><strong>Prescription:</strong> {record.prescription}</div>
                <div><strong>Notes:</strong> {record.notes}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Icon components
const ArrowLeftIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

export default PatientRecords; 
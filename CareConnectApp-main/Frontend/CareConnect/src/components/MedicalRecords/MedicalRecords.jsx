import React, { useState, useEffect } from 'react';
import '../../styles/dashboard.css';
import { useAuth } from '../../context/AuthContext';

const MedicalRecords = () => {
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        // Fetch medical records using user ID
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/patients/records/${user.id}`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch medical records');
        }

        const recordsData = await response.json();
        setMedicalRecords(recordsData);

      } catch (error) {
        console.error('Error fetching medical records:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchMedicalRecords();
    }
  }, [user?.id]);

  return (
    <div className="animate-fade-in">
      <div className="dashboard-card">
        <h2 className="section-title">Medical Records</h2>
        
        {loading && <div>Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Date</th>
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
                  <td className="text-dark">{record.condition}</td>
                  <td>
                    <span className={`status-badge status-${record.diagnosisType?.toLowerCase()}`}>
                      {record.diagnosisType}
                    </span>
                  </td>
                  <td className="text-dark">{record.treatment}</td>
                  <td className="text-dark text-truncate">{record.notes}</td>
                </tr>
              ))}
              {medicalRecords.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No medical records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
import React, { useState, useEffect } from 'react';
import styles from './ResultsManager.module.css';

const ResultsManager = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/test-results/all`,
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
          throw new Error('Failed to fetch test results');
        }

        const data = await response.json();
        setTestResults(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Test Results Management</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient</th>
              <th>Test Name</th>
              <th>Result</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testResults.map((result) => (
              <tr key={result.id}>
                <td>{new Date(result.testDate).toLocaleDateString()}</td>
                <td>{result.patient?.name}</td>
                <td>{result.testName}</td>
                <td>{result.result}</td>
                <td>
                  <span className={`${styles.status} ${styles[result.status?.toLowerCase()]}`}>
                    {result.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button className={styles.actionButton}>View</button>
                  <button className={styles.actionButton}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsManager; 
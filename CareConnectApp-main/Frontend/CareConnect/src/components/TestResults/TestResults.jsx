import React from 'react';
import '../../styles/dashboard.css';

const TestResults = () => {
  // Mock data - replace with actual data from your API
  const testResults = [
    {
      id: 1,
      date: '2024-03-14',
      testName: 'Blood Test',
      result: 'Normal',
      doctor: 'Dr. Johnson',
      status: 'completed'
    },
    // Add more mock results as needed
  ];

  return (
    <div className="animate-fade-in">
      <div className="dashboard-card">
        <h2 className="section-title">Test Results</h2>

        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Test Name</th>
                <th>Result</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((test) => (
                <tr key={test.id}>
                  <td>{new Date(test.date).toLocaleDateString()}</td>
                  <td>{test.testName}</td>
                  <td>{test.result}</td>
                  <td>{test.doctor}</td>
                  <td>
                    <span className={`status-badge status-${test.status}`}>
                      {test.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
import React, { useState } from 'react';
import styles from './ResultsManager.module.css';

const ResultsManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResult, setSelectedResult] = useState(null);
  const itemsPerPage = 8;

  // Mock data - replace with API calls
  const results = [
    {
      id: 1,
      patientName: 'John Doe',
      testType: 'Blood Test',
      doctorName: 'Dr. Smith',
      date: '2024-03-15',
      status: 'pending',
      priority: 'high',
      reportFile: 'blood_test_report.pdf',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      testType: 'X-Ray',
      doctorName: 'Dr. Johnson',
      date: '2024-03-14',
      status: 'completed',
      priority: 'normal',
      reportFile: 'xray_report.pdf',
    },
    // Add more mock results...
  ];

  const handleViewResult = (resultId) => {
    const result = results.find(r => r.id === resultId);
    setSelectedResult(result);
  };

  const handleUploadReport = (resultId) => {
    // Implement report upload logic
    console.log(`Uploading report for result ${resultId}`);
  };

  const handleDownloadReport = (fileName) => {
    // Implement report download logic
    console.log(`Downloading report: ${fileName}`);
  };

  return (
    <div className={styles.resultsManager}>
      <div className={styles.header}>
        <h2 className={styles.title}>Test Results Management</h2>
        <button className={styles.addButton}>
          <PlusIcon />
          New Test Result
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Test Type</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.patientName}</td>
                <td>{result.testType}</td>
                <td>{result.doctorName}</td>
                <td>{result.date}</td>
                <td>
                  <span className={`${styles.status} ${styles[result.status]}`}>
                    {result.status}
                  </span>
                </td>
                <td>
                  <span className={`${styles.priority} ${styles[result.priority]}`}>
                    {result.priority}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleViewResult(result.id)}
                    title="View Details"
                  >
                    <ViewIcon />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleUploadReport(result.id)}
                    title="Upload Report"
                  >
                    <UploadIcon />
                  </button>
                  {result.reportFile && (
                    <button
                      className={styles.actionButton}
                      onClick={() => handleDownloadReport(result.reportFile)}
                      title="Download Report"
                    >
                      <DownloadIcon />
                    </button>
                  )}
                  <button
                    className={styles.actionButton}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Result Details Modal */}
      {selectedResult && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Test Result Details</h3>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedResult(null)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* Add result details here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Icon Components
const PlusIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const ViewIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
);

const UploadIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const DeleteIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default ResultsManager; 
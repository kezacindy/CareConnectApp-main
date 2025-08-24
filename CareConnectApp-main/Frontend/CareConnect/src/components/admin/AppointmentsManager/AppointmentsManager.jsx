import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import styles from './AppointmentsManager.module.css';

const AppointmentsManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time to 12-hour format
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return styles.statusScheduled;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      case 'pending':
        return styles.statusPending;
      default:
        return '';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = (
      appointment.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || appointment.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className={styles.loadingState}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading appointments...</p>
    </div>
  );

  if (error) return (
    <div className={styles.errorState}>
      <p>{error}</p>
      <button onClick={fetchAppointments} className={styles.retryButton}>
        Retry
      </button>
    </div>
  );

  return (
    <div className={styles.appointmentsManager}>
      <div className={styles.header}>
        <h2 className={styles.title}>Appointments Management</h2>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by doctor or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <FaFilter className={styles.filterIcon} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.appointmentsTable}>
          <thead>
            <tr>
              <th className={styles.dateColumn}>Date & Time</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th className={styles.statusColumn}>Status</th>
              <th className={styles.actionsColumn}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className={styles.dateTimeCell}>
                  <div className={styles.date}>{formatDate(appointment.date)}</div>
                  <div className={styles.time}>{formatTime(appointment.time)}</div>
                </td>
                <td className={styles.doctorCell}>
                  <div className={styles.name}>{appointment.doctor?.name || 'N/A'}</div>
                  <div className={styles.specialization}>
                    {appointment.doctor?.specialization}
                  </div>
                </td>
                <td className={styles.patientCell}>
                  <div className={styles.name}>{appointment.patient?.name || 'N/A'}</div>
                  <div className={styles.email}>{appointment.patient?.email}</div>
                </td>
                <td>
                  <span className={`${styles.status} ${getStatusColor(appointment.status)}`}>
                    {appointment.status || 'Pending'}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button 
                    className={`${styles.actionButton} ${styles.viewButton}`}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.editButton}`}
                    title="Edit Appointment"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                    title="Cancel Appointment"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsManager; 
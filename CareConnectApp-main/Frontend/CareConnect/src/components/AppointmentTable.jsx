import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './AppointmentTable.module.css';
import { getAuthHeader } from '../utils/auth';

// Add these icons (you can use any icon library you prefer)
const SearchIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const ViewIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const AssignIcon = () => (
  <svg className={styles.icon} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const AppointmentTable = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState({
    patientName: '',
    time: '',
    status: ''
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'DOCTOR') {
      navigate('/unauthorized');
      return;
    }

    const fetchDoctorData = async () => {
      try {
        // First fetch doctor's details using the user ID
        const doctorResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/doctors/user/${user.id}`, {
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

        // Then fetch appointments using the doctor_id
        const appointmentsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/appointments/doctor/${doctorDetails.id}`, {
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
        console.log('Appointments data:', appointmentsData);
        
        if (Array.isArray(appointmentsData)) {
          const formattedAppointments = appointmentsData.map(apt => ({
            id: apt.id,
            date: apt.date,
            time: apt.time,
            patient: apt.patient?.name || 'Unknown Patient',
            status: apt.status,
          }));
          setAppointments(formattedAppointments);
        } else {
          console.error('Unexpected appointments data structure:', appointmentsData);
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [isAuthenticated, user, navigate]);

  const itemsPerPage = 5;

  // Updated search functionality
  const filteredAppointments = appointments.filter(appointment => {
    if (!appointment) return false;

    const patientNameMatch = appointment.patient?.toLowerCase().includes(searchQuery.patientName.toLowerCase());
    const timeMatch = `${appointment.date} ${appointment.time}`.toLowerCase().includes(searchQuery.time.toLowerCase());
    const statusMatch = searchQuery.status === '' || appointment.status === searchQuery.status;

    return patientNameMatch && timeMatch && statusMatch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

  const currentItemNumber = filteredAppointments.length > 0 ? indexOfFirstItem + 1 : 0;
  const totalItems = filteredAppointments.length;

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleSearch = (field, value) => {
    setSearchQuery(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleViewRecords = (id) => {
    console.log(`Viewing records for patient ID: ${id}`);
  };

  const handleEdit = (id) => {
    console.log(`Editing appointment ID: ${id}`);
  };

  const handleAssignResults = (id) => {
    console.log(`Assigning results for patient ID: ${id}`);
  };

  if (loading) {
    return <div className="loading-spinner">Loading appointments...</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      {doctorData && (
        <div className={styles.doctorInfo}>
          <h2>Dr. {doctorData.name}</h2>
          <p>Specialization: {doctorData.specialization}</p>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <div className={styles.columnHeader}>
                <span>Patient Name</span>
                <div className={styles.inputWrapper}>
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search patient..."
                    value={searchQuery.patientName}
                    onChange={(e) => handleSearch('patientName', e.target.value)}
                    className={styles.columnFilter}
                  />
                </div>
              </div>
            </th>
            <th>
              <div className={styles.columnHeader}>
                <span>Time</span>
                <div className={styles.inputWrapper}>
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search date/time..."
                    value={searchQuery.time}
                    onChange={(e) => handleSearch('time', e.target.value)}
                    className={styles.columnFilter}
                  />
                </div>
              </div>
            </th>
            <th>
              <div className={styles.columnHeader}>
                <span>Status</span>
                <select
                  value={searchQuery.status}
                  onChange={(e) => handleSearch('status', e.target.value)}
                  className={styles.columnFilter}
                >
                  <option value="">All</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patient}</td>
                <td>{`${appointment.date} ${appointment.time}`}</td>
                <td>
                  <span 
                    className={`${styles.status} ${
                      appointment.status === 'COMPLETED' 
                        ? styles.completed 
                        : appointment.status === 'SCHEDULED'
                        ? styles.pending
                        : styles.cancelled
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className={styles.actionButtons}>
                  <button 
                    className={`${styles.actionButton} ${styles.viewButton}`}
                    onClick={() => handleViewRecords(appointment.id)}
                  >
                    <ViewIcon />
                    View Records
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEdit(appointment.id)}
                  >
                    <EditIcon />
                    Edit
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.assignButton}`}
                    onClick={() => handleAssignResults(appointment.id)}
                  >
                    <AssignIcon />
                    Assign Results
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className={styles.noData}>
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className={styles.pagination}>
        <button 
          className={styles.paginationButton}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        <span className={styles.pageInfo}>
          Appointment {currentItemNumber} of {totalItems}
        </span>
        <button 
          className={styles.paginationButton}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default AppointmentTable;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Cards from '../components/Cards';
import AppointmentTable from '../components/AppointmentTable';
import DoctorNavbar from '../components/DoctorNavbar/DoctorNavbar';
import DoctorMedicalRecords from '../components/DoctorMedicalRecords/DoctorMedicalRecords';
import DoctorTestResults from '../components/DoctorTestResults/DoctorTestResults';
import styles from './Doctorboard.module.css';

const Doctorboard = () => {
  const { user } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // First fetch doctor's details using the user ID
        const doctorResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!doctorResponse.ok) {
          throw new Error('Failed to fetch doctor data');
        }

        const doctorDetails = await doctorResponse.json();
        setDoctorData(doctorDetails);

        // Then fetch appointments using the doctor_id
        const appointmentsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/appointments/doctor/${doctorDetails.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!appointmentsResponse.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDoctorData();
    }
  }, [user]);

  const renderContent = () => {
    switch (activePage) {
      case 'medicalRecords':
        return <DoctorMedicalRecords />;
      case 'testResults':
        return <DoctorTestResults />;
      case 'dashboard':
      default:
        return (
          <>
            <header className={styles.header}>
              <h1>Welcome, Dr. {doctorData?.name || 'Loading...'}</h1>
              <p>Here's what you have planned for today.</p>
              <div className={styles.doctorInfo}>
                <p>Specialization: {doctorData?.specialization}</p>
                <p>Experience: {doctorData?.experience} years</p>
              </div>
            </header>
            <div className={styles.cardsContainer}>
              <Cards stats={stats} />
            </div>
            <section className={styles.appointmentSection}>
              <h2>Today's Appointments</h2>
              <div className={styles.tableContainer}>
                <AppointmentTable />
              </div>
            </section>
          </>
        );
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  const stats = {
    totalAppointments: appointments.length,
    completedAppointments: appointments.filter(a => a.status === 'COMPLETED').length,
    pendingAppointments: appointments.filter(a => a.status === 'PENDING').length,
  };

  return (
    <div className={styles.doctorDashboard}>
      <DoctorNavbar 
        doctorData={doctorData} 
        activePage={activePage}
        onMenuItemClick={setActivePage}
      />
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Doctorboard;

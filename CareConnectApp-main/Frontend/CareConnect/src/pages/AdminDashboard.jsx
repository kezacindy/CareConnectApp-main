import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar/AdminSidebar';
import DoctorsManager from '../components/admin/DoctorsManager/DoctorsManager';
import PatientsManager from '../components/admin/PatientsManager/PatientsManager';
import AppointmentsManager from '../components/admin/AppointmentsManager/AppointmentsManager';
import ResultsManager from '../components/admin/ResultsManager/ResultsManager';
import GlobalSearch from '../components/GlobalSearch/GlobalSearch';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    appointmentsByDoctor: [],
    patientFrequency: [],
    timeSlots: {},
    doctorWorkload: [],
    specializationDemand: {}
  });

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const endpoints = [
        '/api/admin/stats/appointments/status-by-doctor',
        '/api/admin/stats/patients/appointments-frequency',
        '/api/admin/stats/appointments/time-slots',
        '/api/admin/stats/doctors/workload',
        '/api/admin/stats/specializations/demand'
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint => 
          fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
            return res.json();
          })
        )
      );

      setDashboardData({
        appointmentsByDoctor: responses[0],
        patientFrequency: responses[1],
        timeSlots: responses[2],
        doctorWorkload: responses[3],
        specializationDemand: responses[4]
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboardContent = () => (
    <div className={styles.dashboardContent}>
      <h1>Welcome, {user?.username}!</h1>

      {/* Doctor Workload Section */}
      <section className={styles.statsSection}>
        <h2>Doctor Workload</h2>
        <div className={styles.statsGrid}>
          {dashboardData.doctorWorkload.map((doctor, index) => (
            <div key={index} className={`${styles.statCard} ${styles.workload}`}>
              <h3 title={doctor.doctorName}>{doctor.doctorName}</h3>
              <p className={styles.specialization}>{doctor.specialization}</p>
              <div className={styles.statDetails}>
                <div>
                  <span className={styles.statLabel}>Today</span>
                  <span className={styles.statNumber}>
                    {doctor.todayAppointments}
                  </span>
                </div>
                <div>
                  <span className={styles.statLabel}>Week</span>
                  <span className={styles.statNumber}>
                    {doctor.weeklyAppointments}
                  </span>
                </div>
                <div>
                  <span className={styles.statLabel}>Avg/Day</span>
                  <span className={styles.statNumber}>
                    {doctor.averageWeeklyLoad.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Patients Section */}
      <section className={styles.statsSection}>
        <h2>Top 10 Active Patients</h2>
        <div className={styles.statsGrid}>
          {dashboardData.patientFrequency.map((patient, index) => (
            <div key={index} className={`${styles.statCard} ${styles.patient}`}>
              <h3>{patient.patientName}</h3>
              <div className={styles.statValue}>
                {patient.totalAppointments} appointments
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specialization Demand Section */}
      <section className={styles.statsSection}>
        <h2>Specialization Demand</h2>
        <div className={styles.statsGrid}>
          {Object.entries(dashboardData.specializationDemand.demandRatio || {}).map(([spec, ratio], index) => (
            <div key={index} className={`${styles.statCard} ${styles.specialization}`}>
              <h3>{spec}</h3>
              <div className={styles.statDetails}>
                <div>
                  <span>Appointments</span>
                  <span>{dashboardData.specializationDemand.appointmentsPerSpecialization[spec]}</span>
                </div>
                <div>
                  <span>Doctors</span>
                  <span>{dashboardData.specializationDemand.doctorsPerSpecialization[spec]}</span>
                </div>
                <div>
                  <span>Demand Ratio</span>
                  <span>{ratio.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case 'doctors':
        return <DoctorsManager />;
      case 'patients':
        return <PatientsManager />;
      case 'appointments':
        return <AppointmentsManager />;
      case 'results':
        return <ResultsManager />;
      default:
        return renderDashboardContent();
    }
  };

  if (loading) return <div className={styles.loading}>Loading dashboard data...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.adminDashboard}>
      <AdminSidebar 
        activeItem={activePage} 
        onMenuItemClick={setActivePage} 
      />
      <main className={styles.mainContent}>
        <GlobalSearch onMenuItemClick={setActivePage} />
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard; 
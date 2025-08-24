import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import MedicalRecords from '../components/MedicalRecords/MedicalRecords';
import TestResults from '../components/TestResults/TestResults';
import AppointmentList from '../components/Appointments/AppointmentList';
import Settings from '../components/Settings/Settings';
import { FaCalendarCheck, FaFileAlt, FaChartLine, FaUserMd } from 'react-icons/fa';
import '../styles/dashboard.css';

const PatientDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: [],
    recentTests: [],
    recentRecords: []
  });

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Add your data fetching logic here
  };

  const renderDashboardOverview = () => (
    <div className="dashboard-overview animate-fade-in">
      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="dashboard-stat-card">
            <div className="stat-icon">
              <FaCalendarCheck />
            </div>
            <div className="stat-content">
              <h3>Next Appointment</h3>
              <p>March 25, 2024</p>
            </div>
          </div>
        </div>
        {/* Add more stat cards */}
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="section-title">Upcoming Appointments</h3>
              <button className="btn-link">View All</button>
            </div>
            <div className="upcoming-appointments">
              {/* Appointments list */}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="section-title">Recent Test Results</h3>
              <button className="btn-link">View All</button>
            </div>
            <div className="recent-tests">
              {/* Test results list */}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="section-title">Medical History Overview</h3>
            </div>
            <div className="medical-history">
              {/* Medical history timeline */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComponent = () => {
    switch (activeComponent) {
      case 'appointments':
        return <AppointmentList />;
      case 'medicalRecords':
        return <MedicalRecords />;
      case 'testResults':
        return <TestResults />;
      case 'settings':
        return <Settings />;
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeItem={activeComponent} onMenuItemClick={setActiveComponent} />
      <main className="main-content">
        {renderComponent()}
      </main>
    </div>
  );
};

export default PatientDashboard; 
import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Appointments from '../Appointments/AppointmentList';
import MedicalRecords from '../MedicalRecords/MedicalRecords';
import TestResults from '../TestResults/TestResults';
import Settings from '../Settings/Settings';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'appointments':
        return <Appointments />;
      case 'medicalRecords':
        return <MedicalRecords />;
      case 'testResults':
        return <TestResults />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div>
            <h1>Welcome to the CareConnect Dashboard!</h1>
            <div className="cards-container">
              <div className="card">
                <h3>Total Doctors</h3>
                <p>10</p>
              </div>
              <div className="card">
                <h3>Recent Appointments</h3>
                <p>3</p>
              </div>
              <div className="card">
                <h3>Medical Results</h3>
                <p>5</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeItem={activePage} onMenuItemClick={setActivePage} />
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;

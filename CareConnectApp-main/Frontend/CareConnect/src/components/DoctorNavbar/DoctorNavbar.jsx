import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './DoctorNavbar.module.css';
import { FaUserMd, FaSignOutAlt, FaNotesMedical, FaFlask } from 'react-icons/fa';

const DoctorNavbar = ({ doctorData, activePage, onMenuItemClick }) => {
  const { logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <div className={styles.logo}>
          <FaUserMd />
          <span>Doctor Portal</span>
        </div>
        <div className={styles.navLinks}>
          <button 
            onClick={() => onMenuItemClick('dashboard')}
            className={`${styles.navLink} ${
              activePage === 'dashboard' ? styles.active : ''
            }`}
          >
            <FaUserMd />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => onMenuItemClick('medicalRecords')}
            className={`${styles.navLink} ${
              activePage === 'medicalRecords' ? styles.active : ''
            }`}
          >
            <FaNotesMedical />
            <span>Medical Records</span>
          </button>
          <button 
            onClick={() => onMenuItemClick('testResults')}
            className={`${styles.navLink} ${
              activePage === 'testResults' ? styles.active : ''
            }`}
          >
            <FaFlask />
            <span>Test Results</span>
          </button>
        </div>
      </div>

      <div className={styles.navRight}>
        <div className={styles.doctorInfo}>
          <span className={styles.doctorName}>
            Dr. {doctorData?.name || 'Loading...'}
          </span>
          <span className={styles.specialization}>
            {doctorData?.specialization}
          </span>
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default DoctorNavbar; 
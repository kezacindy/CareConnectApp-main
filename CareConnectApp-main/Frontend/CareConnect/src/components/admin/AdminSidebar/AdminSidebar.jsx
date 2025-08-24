import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './AdminSidebar.module.css';

const AdminSidebar = ({ activeItem, onMenuItemClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-chart-line'
    },
    {
      id: 'doctors',
      label: 'Doctors',
      icon: 'fas fa-user-md'
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: 'fas fa-users'
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: 'fas fa-calendar-check'
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
                        <img src="/telemed-logo.svg" alt="CareConnect Logo" />
        <span>Admin Panel</span>
      </div>

      <nav className={styles.navigation}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeItem === item.id ? styles.active : ''}`}
            onClick={() => onMenuItemClick(item.id)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className={styles.logoutButton} onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default AdminSidebar; 
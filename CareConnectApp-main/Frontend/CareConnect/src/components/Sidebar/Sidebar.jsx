import React from 'react';
import './Sidebar.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserMd, FaCalendarAlt, FaFileMedical, FaFlask, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ activeItem, onMenuItemClick }) => {
  const { logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome size={20} /> },
    { id: 'appointments', label: 'Appointments', icon: <FaCalendarAlt size={20} /> },
    { id: 'medicalRecords', label: 'Medical Records', icon: <FaFileMedical size={20} /> },
    { id: 'testResults', label: 'Test Results', icon: <FaFlask size={20} /> },
    { id: 'settings', label: 'Settings', icon: <FaCog size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await authLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
                        <img src="/telemed-logo.svg" alt="CareConnect Logo" className="sidebar-logo" />
                <h2>CareConnect</h2>
      </div>

      <div className="menu-section">
        <div className="menu-label">MENU</div>
        <ul className="menu-items">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => onMenuItemClick(item.id)}
            >
              <div className="menu-icon">{item.icon}</div>
              <span className="menu-text">{item.label}</span>
              {activeItem === item.id && <div className="active-indicator" />}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleLogout} className="logout-button">
        <FaSignOutAlt size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;

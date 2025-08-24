import React, { useState } from 'react';
import styles from './UsersManager.module.css';

const UsersManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 8;

  // Mock data - replace with API calls
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234-567-8900',
      registeredDate: '2024-01-15',
      lastVisit: '2024-03-10',
      status: 'active',
    },
    // Add more mock users...
  ];

  const handleEditUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
  };

  const handleStatusChange = async (userId, newStatus) => {
    // Implement status update logic
    console.log(`Updating user ${userId} status to ${newStatus}`);
  };

  return (
    <div className={styles.usersManager}>
      <div className={styles.header}>
        <h2 className={styles.title}>Users Management</h2>
        <button className={styles.addButton}>
          <PlusIcon />
          Add New User
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registered</th>
              <th>Last Visit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.registeredDate}</td>
                <td>{user.lastVisit}</td>
                <td>
                  <span className={`${styles.status} ${styles[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button 
                    className={styles.actionButton} 
                    onClick={() => handleEditUser(user.id)}
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                  <button 
                    className={styles.actionButton}
                    title="View Details"
                  >
                    <ViewIcon />
                  </button>
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

      {/* User Edit Modal */}
      {selectedUser && (
        <div className={styles.modal}>
          {/* Add user edit form */}
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

// Add other icon components similar to AppointmentsManager...

export default UsersManager; 
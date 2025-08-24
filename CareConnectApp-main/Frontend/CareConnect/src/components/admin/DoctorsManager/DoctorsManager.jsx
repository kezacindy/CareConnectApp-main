import React, { useState, useEffect } from 'react';
import styles from './DoctorsManager.module.css';
import { FaPlus, FaSearch, FaTrash, FaEdit } from 'react-icons/fa';
import DoctorFormModal from './DoctorFormModal';

const DoctorsManager = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    specialization: '',
    status: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      setError('Failed to fetch doctors');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setIsModalOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/doctors/${doctorId}`,
          {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.ok) {
          setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
        }
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedDoctor) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/doctors/${selectedDoctor.id}`,
          {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update doctor');
        }

        const updatedDoctor = await response.json();
        setDoctors(doctors.map(doc => 
          doc.id === selectedDoctor.id ? updatedDoctor : doc
        ));
      } else {
        setDoctors(prevDoctors => [...prevDoctors, formData]);
      }

      setNotification({
        show: true,
        message: selectedDoctor 
          ? `Dr. ${formData.name} has been updated successfully`
          : `Dr. ${formData.name} has been added successfully`,
        type: 'success'
      });

      if (response.ok) {
        await fetchDoctors();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    return (
      doctor.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      doctor.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase()) &&
      (filters.status === '' || doctor.status === filters.status)
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.doctorsManager}>
      <div className={styles.header}>
        <h2>Doctors Management</h2>
        <button className={styles.addButton} onClick={handleAddDoctor}>
          <FaPlus /> Add Doctor
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="text"
                  placeholder="Search Name"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  className={styles.columnFilter}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Email"
                  value={filters.email}
                  onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                  className={styles.columnFilter}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search Specialization"
                  value={filters.specialization}
                  onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                  className={styles.columnFilter}
                />
              </th>
              <th>Phone</th>
              <th>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className={styles.columnFilter}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.phone}</td>
                <td>
                  <span className={`${styles.status} ${styles[doctor.status]}`}>
                    {doctor.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    onClick={() => handleEditDoctor(doctor)}
                    className={styles.actionButton}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    className={styles.actionButton}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <DoctorFormModal
          doctor={selectedDoctor}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default DoctorsManager; 
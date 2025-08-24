import React from 'react';
import styles from './DashboardStats.module.css';

// Icon Components
const AppointmentIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PatientIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const DoctorIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ResultIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DashboardStats = () => {
  const stats = [
    {
      id: 1,
      title: 'Total Appointments',
      value: '1,234',
      trend: '+12.5%',
      trendUp: true,
      icon: AppointmentIcon,
      color: 'blue',
    },
    {
      id: 2,
      title: 'Active Patients',
      value: '856',
      trend: '+5.2%',
      trendUp: true,
      icon: PatientIcon,
      color: 'green',
    },
    {
      id: 3,
      title: 'Available Doctors',
      value: '48',
      trend: '-2.4%',
      trendUp: false,
      icon: DoctorIcon,
      color: 'purple',
    },
    {
      id: 4,
      title: 'Test Results Pending',
      value: '123',
      trend: '+8.1%',
      trendUp: true,
      icon: ResultIcon,
      color: 'orange',
    },
  ];

  return (
    <div className={styles.dashboardStats}>
      <h2 className={styles.title}>Dashboard Overview</h2>
      
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.id} className={`${styles.statCard} ${styles[stat.color]}`}>
            <div className={styles.statIcon}>
              <stat.icon />
            </div>
            <div className={styles.statInfo}>
              <h3 className={styles.statTitle}>{stat.title}</h3>
              <p className={styles.statValue}>{stat.value}</p>
              <span className={`${styles.statTrend} ${stat.trendUp ? styles.up : styles.down}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* We'll add charts and other components here */}
    </div>
  );
};

export default DashboardStats; 
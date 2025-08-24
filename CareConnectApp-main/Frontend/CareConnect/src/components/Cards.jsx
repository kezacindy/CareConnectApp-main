import React from 'react';
import styles from './Cards.module.css';

const Cards = ({ stats }) => {
  return (
    <>
      <div className={`${styles.card} ${styles.totalCard}`}>
        <h3 className={styles.cardTitle}>Total Appointments</h3>
        <div className={styles.cardValue}>{stats.totalAppointments}</div>
      </div>
      <div className={`${styles.card} ${styles.completedCard}`}>
        <h3 className={styles.cardTitle}>Completed</h3>
        <div className={styles.cardValue}>{stats.completedAppointments}</div>
      </div>
      <div className={`${styles.card} ${styles.pendingCard}`}>
        <h3 className={styles.cardTitle}>Pending</h3>
        <div className={styles.cardValue}>{stats.pendingAppointments}</div>
      </div>
    </>
  );
};

export default Cards;

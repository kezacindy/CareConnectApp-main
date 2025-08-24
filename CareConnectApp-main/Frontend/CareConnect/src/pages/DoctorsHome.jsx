import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from './DoctorsHome.module.css';
import '../styles/pages.css';

// Import doctor images
import drSmithImage from '../assets/images/Dr.smith.jpg';
import drJohnsonImage from '../assets/images/Dr.johnson.jpg';
import drleeImage from '../assets/images/Dr.lee.jpg';

const DoctorsHome = () => {
  const [viewedDoctorId, setViewedDoctorId] = useState(null);
  const navigate = useNavigate();

  const doctors = [
    {
      id: 1,
      name: 'Dr. Lucas Smith',
      age: 65,
      specialization: 'Cardiology',
      description: 'Expert in treating heart conditions with over 20 years of experience. Specialized in preventive cardiology and heart failure management.',
      image: drSmithImage,
      schedule: 'Monday - Friday: 9 AM - 12 PM',
      availability: '80%',
    },
    {
      id: 2,
      name: 'Dr. Michael Johnson',
      age: 38,
      specialization: 'Dermatology',
      description: 'Specialist in skin care and cosmetic dermatology. Expertise in treating various skin conditions and performing advanced cosmetic procedures.',
      image: drJohnsonImage,
      schedule: 'Tuesday, Thursday: 10 AM - 2 PM',
      availability: '60%',
    },
    {
      id: 3,
      name: 'Dr. Emily Lee',
      age: 35,
      specialization: 'Dentistry',
      description: 'Renowned dentist dedicated to providing exceptional oral care. Specialized in cosmetic dentistry and oral surgery.',
      image: drleeImage,
      schedule: 'Monday, Wednesday, Friday: 8 AM - 1 PM',
      availability: '75%',
    },
  ];

  const toggleSchedule = (id) => {
    setViewedDoctorId((prevId) => (prevId === id ? null : id));
  };

  const handleBookAppointment = (doctorId) => {
    navigate('/dashboard', { state: { doctorId } });
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="container hero-content">
          <header className="text-center mb-5 animate-fadeInUp">
            <h1 className="display-4 text-white mb-3">Meet Our Expert Doctors</h1>
            <p className="lead text-white-50">
              Connect with our experienced healthcare professionals who are dedicated to providing you with the best medical care.
            </p>
          </header>
        </div>
      </section>

      <section className="page-section bg-light">
        <div className="container">
          <div className="row g-4">
            {doctors.map((doctor, index) => (
              <div key={doctor.id} className="col-lg-4 col-md-6 animate-fadeInUp" 
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}>
                <div className="doctor-card h-100">
                  <div className="position-relative">
                    <img
                      src={doctor.image}
                      alt={`Dr. ${doctor.name}`}
                      className="w-100 h-100 object-fit-cover rounded-top"
                      style={{ height: '300px' }}
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark text-white">
                      <h3 className="h4 mb-1">{doctor.name}</h3>
                      <p className="mb-0 text-white-50">{doctor.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="badge bg-primary-light text-primary">
                        {doctor.age} years experience
                      </span>
                      <span className="badge bg-success-light text-success">
                        {doctor.availability} available
                      </span>
                    </div>
                    
                    <p className="text-muted mb-4">{doctor.description}</p>
                    
                    <button
                      className="btn btn-outline-primary w-100 mb-3"
                      onClick={() => toggleSchedule(doctor.id)}
                    >
                      {viewedDoctorId === doctor.id ? 'Hide Schedule' : 'View Schedule'}
                    </button>
                    
                    {viewedDoctorId === doctor.id && (
                      <div className="schedule-info animate-fadeInUp">
                        <div className="p-3 bg-light rounded mb-3">
                          <h4 className="h6 mb-2">Available Hours</h4>
                          <p className="mb-0 text-muted small">
                            {doctor.schedule}
                          </p>
                        </div>
                        <button
                          className="btn btn-gradient w-100"
                          onClick={() => handleBookAppointment(doctor.id)}
                        >
                          Book Appointment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section info-section">
        <div className="container text-center">
          <h2 className="h1 text-white mb-4">Ready to Get Started?</h2>
          <p className="lead text-white-50 mb-4">
            Book your consultation with one of our experienced healthcare professionals today.
          </p>
          <button 
            className="btn btn-light btn-lg rounded-pill px-5"
            onClick={() => navigate('/register')}
          >
            Register Now
          </button>
        </div>
      </section>

      <footer className="py-4 bg-dark text-white-50 text-center">
        <div className="container">
                          <p className="mb-0">© {new Date().getFullYear()} CareConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DoctorsHome;

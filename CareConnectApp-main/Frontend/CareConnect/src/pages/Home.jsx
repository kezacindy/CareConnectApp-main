import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import drJobImage from '../assets/images/drjob.jpeg';
import styles from './Home.module.css';

function Home() {
  const features = [
    {
      icon: 'fa-video',
      title: 'Virtual Consultations',
      description: 'Connect with top healthcare professionals from the comfort of your home.'
    },
    {
      icon: 'fa-calendar-check',
      title: 'Easy Scheduling',
      description: 'Book appointments with just a few clicks, anytime, anywhere.'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Secure & Private',
      description: 'Your health information is protected with state-of-the-art security.'
    }
  ];

  return (
    <div className={styles.container}>
      <Navbar />
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.textContent}>
            <h1>Your Health, Our Priority</h1>
            <p>Connect with professional healthcare providers anytime, anywhere.</p>
            <div className="d-flex gap-3">
              <Link to="/register" className="btn btn-gradient">
                Get Started
              </Link>
              <Link to="/about" className="btn btn-outline-light rounded-pill px-4">
                Learn More
              </Link>
            </div>
          </div>
          <div className={styles.imageContent}>
            <img 
              src={drJobImage} 
              alt="Professional Healthcare Doctor"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      <section className="page-section bg-light">
        <div className="container">
          <div className="text-center mb-5">
                            <h2 className="section-title">Why Choose CareConnect?</h2>
            <p className="text-muted lead">
              Transforming healthcare with technology and compassion
            </p>
          </div>
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="feature-card animate-fadeInUp" style={{ animationDelay: `${0.2 * (index + 1)}s` }}>
                  <div className="mb-3">
                    <i className={`fas ${feature.icon} fa-3x`} style={{ color: 'var(--primary-color)' }}></i>
                  </div>
                  <h3 className="h4 mb-3">{feature.title}</h3>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section info-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="h1 mb-3">Ready to Take Control of Your Health?</h2>
              <p className="lead mb-0">
                Join thousands of patients who have transformed their 
                healthcare experience with CareConnect.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <Link to="/register" className="btn btn-light btn-lg rounded-pill px-4">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

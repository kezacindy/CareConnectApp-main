import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages.css';
import medicalTeamImage from '../assets/images/medicalteam.jpg';

function About() {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      description: "With over 15 years of experience in telemedicine"
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Technology",
      description: "Leading our digital healthcare innovations"
    },
    {
      name: "Dr. Lisa Williams",
      role: "Patient Care Director",
      description: "Ensuring the highest standards of patient care"
    }
  ];

  const achievements = [
    {
      number: "50,000+",
      label: "Patients Served",
      icon: "fa-users"
    },
    {
      number: "1,000+",
      label: "Healthcare Providers",
      icon: "fa-user-md"
    },
    {
      number: "98%",
      label: "Patient Satisfaction",
      icon: "fa-heart"
    }
  ];

  return (
    <div className="about-page">
      <Navbar />
      
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="container hero-content">
          <div className="row align-items-center">
            <div className="col-md-6 animate-fadeInUp">
              <div className="mb-4">
                <span className="badge bg-white text-primary px-3 py-2 mb-3" style={{ fontSize: '0.9rem' }}>
                  <i className="fas fa-star me-2"></i>Leading Healthcare Platform
                </span>
              </div>
              <h1 className="display-4 text-white mb-4 fw-bold">About CareConnect</h1>
              <p className="lead text-white-50 mb-4">
                Revolutionizing Healthcare Through Digital Innovation
              </p>
              <p className="text-white-50 mb-4">
                Founded in 2020, CareConnect has grown to become a leading telemedicine platform, 
                connecting patients with healthcare providers nationwide. Our mission is to make 
                quality healthcare accessible to everyone, anywhere.
              </p>
              <div className="d-flex gap-3">
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-heartbeat fa-2x text-white"></i>
                  </div>
                  <p className="text-white-50 small mb-0">Quality Care</p>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-shield-alt fa-2x text-white"></i>
                  </div>
                  <p className="text-white-50 small mb-0">Secure</p>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-clock fa-2x text-white"></i>
                  </div>
                  <p className="text-white-50 small mb-0">24/7 Access</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="position-relative">
                <img 
                  src={medicalTeamImage}
                  alt="Medical Team" 
                  className="img-fluid rounded-4 shadow-lg"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '1.5rem'
                  }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 rounded-4" 
                     style={{ 
                       background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                       pointerEvents: 'none'
                     }}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary text-white px-3 py-2 mb-3" style={{ fontSize: '0.9rem' }}>
              <i className="fas fa-chart-line me-2"></i>Our Achievements
            </span>
            <h2 className="section-title">Making a Difference</h2>
            <p className="text-muted lead">Transforming healthcare delivery through innovation and compassion</p>
          </div>
          
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="feature-card h-100 position-relative overflow-hidden">
                <div className="position-absolute top-0 end-0 p-3">
                  <i className="fas fa-star text-warning fa-2x opacity-25"></i>
                </div>
                <div className="mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-heart fa-2x text-primary"></i>
                  </div>
                </div>
                <h4 className="section-title h3 mb-4">Our Values</h4>
                <ul className="list-unstyled">
                  <li className="mb-3 d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="fas fa-check text-success fa-sm"></i>
                    </div>
                    <span>Patient-First Approach</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="fas fa-check text-success fa-sm"></i>
                    </div>
                    <span>Technological Innovation</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="fas fa-check text-success fa-sm"></i>
                    </div>
                    <span>Privacy and Security</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="fas fa-check text-success fa-sm"></i>
                    </div>
                    <span>Accessibility</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="fas fa-check text-success fa-sm"></i>
                    </div>
                    <span>Continuous Improvement</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="feature-card">
                <div className="row">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="col-md-4 text-center mb-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                        <i className={`fas ${achievement.icon} fa-2x text-primary`}></i>
                      </div>
                      <h2 className="h1 fw-bold text-primary mb-2">{achievement.number}</h2>
                      <p className="text-muted fw-semibold">{achievement.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-top">
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="bg-success bg-opacity-10 rounded p-3">
                        <i className="fas fa-award fa-2x text-success mb-2"></i>
                        <p className="small mb-0 fw-semibold">Award Winning</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="bg-info bg-opacity-10 rounded p-3">
                        <i className="fas fa-globe fa-2x text-info mb-2"></i>
                        <p className="small mb-0 fw-semibold">Global Reach</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="bg-warning bg-opacity-10 rounded p-3">
                        <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                        <p className="small mb-0 fw-semibold">24/7 Support</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="bg-danger bg-opacity-10 rounded p-3">
                        <i className="fas fa-shield-alt fa-2x text-danger mb-2"></i>
                        <p className="small mb-0 fw-semibold">Secure Platform</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary text-white px-3 py-2 mb-3" style={{ fontSize: '0.9rem' }}>
              <i className="fas fa-users me-2"></i>Meet Our Team
            </span>
            <h2 className="section-title">Our Leadership Team</h2>
            <p className="text-muted lead">Experienced professionals dedicated to revolutionizing healthcare</p>
          </div>
          
          <div className="row">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-lg-4 mb-4">
                <div className="feature-card text-center h-100 position-relative overflow-hidden">
                  <div className="position-absolute top-0 end-0 p-3">
                    <i className="fas fa-quote-right text-primary fa-lg opacity-25"></i>
                  </div>
                  <div className="mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px' }}>
                      <i className="fas fa-user-md fa-3x text-primary"></i>
                    </div>
                  </div>
                  <h3 className="h4 mb-3 fw-bold">{member.name}</h3>
                  <p className="text-primary mb-3 fw-semibold">{member.role}</p>
                  <p className="text-muted mb-4">{member.description}</p>
                  <div className="d-flex justify-content-center gap-2">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <i className="fas fa-linkedin text-success fa-sm"></i>
                    </div>
                    <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <i className="fas fa-twitter text-info fa-sm"></i>
                    </div>
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <i className="fas fa-envelope text-primary fa-sm"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Mission & Vision Section */}
      <section className="page-section bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4">
              <div className="feature-card h-100">
                <div className="mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-bullseye fa-2x text-primary"></i>
                  </div>
                </div>
                <h3 className="section-title h3 mb-4">Our Mission</h3>
                <p className="text-muted mb-4">
                  To revolutionize healthcare delivery by making quality medical care accessible, 
                  affordable, and convenient for everyone, regardless of their location or circumstances.
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                    <i className="fas fa-check text-success"></i>
                  </div>
                  <span className="fw-semibold">Accessible Healthcare</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="feature-card h-100">
                <div className="mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-eye fa-2x text-primary"></i>
                  </div>
                </div>
                <h3 className="section-title h3 mb-4">Our Vision</h3>
                <p className="text-muted mb-4">
                  To become the world's leading digital healthcare platform, connecting millions 
                  of patients with healthcare providers through innovative technology and compassionate care.
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                    <i className="fas fa-rocket text-info"></i>
                  </div>
                  <span className="fw-semibold">Global Healthcare Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="page-section" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)' }}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="text-white mb-4 fw-bold">Ready to Experience Better Healthcare?</h2>
              <p className="text-white-50 mb-4 lead">
                Join thousands of patients who have already transformed their healthcare experience with CareConnect.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-light btn-lg px-4">
                  <i className="fas fa-user-plus me-2"></i>Get Started
                </button>
                <button className="btn btn-outline-light btn-lg px-4">
                  <i className="fas fa-play me-2"></i>Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;

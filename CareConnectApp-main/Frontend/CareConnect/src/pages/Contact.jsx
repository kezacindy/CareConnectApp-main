import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement contact form submission logic
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon!');
  };

  const officeLocations = [
    {
      city: "New York",
      address: "123 Healthcare Ave, NY 10001",
      phone: "(212) 555-0123"
    },
    {
      city: "Los Angeles",
      address: "456 Medical Blvd, LA 90001",
      phone: "(310) 555-0123"
    },
    {
      city: "Chicago",
      address: "789 Wellness St, CH 60601",
      phone: "(312) 555-0123"
    }
  ];

  const faqItems = [
    {
      question: "How quickly can I get an appointment?",
      answer: "Most appointments can be scheduled within 24-48 hours of request."
    },
    {
      question: "What insurance plans do you accept?",
      answer: "We accept most major insurance plans. Contact us for specific details."
    },
    {
      question: "Is telemedicine right for me?",
      answer: "Telemedicine is suitable for many non-emergency medical needs. Our team can help determine if it's right for you."
    }
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="container hero-content">
          <div className="text-center mb-5 animate-fadeInUp">
            <h1 className="display-4 text-white mb-3">Get in Touch</h1>
            <p className="lead text-white-50">
              Have questions? We're here to help 24/7
            </p>
          </div>
        </div>
      </section>

      <section className="page-section bg-light">
        <div className="container">
          <div className="row g-4">
            {/* Contact Form */}
            <div className="col-lg-7 animate-fadeInUp">
              <div className="feature-card h-100">
                <h2 className="section-title h3 mb-4">Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-user"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required 
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required 
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Phone Number (Optional)</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-phone"></i>
                      </span>
                      <input 
                        type="tel" 
                        className="form-control" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Your Message</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-message"></i>
                      </span>
                      <textarea 
                        className="form-control" 
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-gradient">
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="col-lg-5 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              {/* Office Locations */}
              <div className="feature-card mb-4">
                <h3 className="h4 mb-4">Our Offices</h3>
                {officeLocations.map((location, index) => (
                  <div key={index} className="d-flex align-items-start mb-4">
                    <div className="me-3">
                      <i className="fas fa-location-dot fa-lg text-primary"></i>
                    </div>
                    <div>
                      <h4 className="h6 mb-1">{location.city}</h4>
                      <p className="mb-1 text-muted">{location.address}</p>
                      <p className="mb-0 text-primary">{location.phone}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="feature-card mb-4">
                <h3 className="h4 mb-4">Frequently Asked Questions</h3>
                {faqItems.map((item, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="h6 mb-2">{item.question}</h4>
                    <p className="text-muted mb-0">{item.answer}</p>
                  </div>
                ))}
              </div>

              {/* Emergency Contact */}
              <div className="feature-card bg-primary text-white">
                <h3 className="h4 mb-3">24/7 Emergency Support</h3>
                <p className="mb-2">For urgent medical concerns:</p>
                <h4 className="h3 mb-0">1-800-CARECONNECT</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/pages.css';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Pages that should have transparent navbar initially
  const transparentNavbarPages = ['/', '/about', '/contact', '/doctor'];
  const shouldBeTransparent = transparentNavbarPages.includes(location.pathname);

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    if (shouldBeTransparent) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [shouldBeTransparent]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`}
      style={{ 
        backgroundColor: (!shouldBeTransparent || isScrolled) ? 'var(--surface-color)' : 'transparent',
        transition: 'all 0.3s ease',
        backdropFilter: (!shouldBeTransparent || isScrolled) ? 'blur(10px)' : 'none',
      }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img 
                            src="/telemed-logo.svg"
                alt="CareConnect Logo" 
            width="40" 
            height="40" 
            className="me-2" 
            style={{ transition: 'transform 0.3s ease' }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          />
          <span className="fw-bold" 
            style={{ 
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.5rem'
            }}>
                            CareConnect
          </span>
        </Link>
        
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars" style={{ 
            color: (!shouldBeTransparent || isScrolled) ? 'var(--text-color)' : 'white' 
          }}></i>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {[
              { path: '/', label: 'Home' },
              { path: '/about', label: 'About' },
              { path: '/contact', label: 'Contact' },
              { path: '/doctor', label: 'Doctors' },
              { path: '/login', label: 'Login' }
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <Link 
                  className={`nav-link px-3 ${isActive(item.path) ? 'active' : ''}`}
                  to={item.path}
                  style={{ 
                    color: (!shouldBeTransparent || isScrolled) ? 'var(--text-color)' : 'white',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {item.label}
                  <span className="nav-link-hover"></span>
                </Link>
              </li>
            ))}

            <li className="nav-item ms-2">
              <Link 
                className="nav-link btn btn-gradient rounded-pill px-4" 
                to="/register"
                style={{
                  transition: 'all 0.3s ease',
                  border: 'none',
                  padding: '8px 24px'
                }}
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);

  // Load stored data on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedPatientInfo = localStorage.getItem('patientInfo');
      const storedDoctorInfo = localStorage.getItem('doctorInfo');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }

      if (storedPatientInfo) {
        const parsedPatientInfo = JSON.parse(storedPatientInfo);
        setPatientInfo(parsedPatientInfo);
      }

      if (storedDoctorInfo) {
        const parsedDoctorInfo = JSON.parse(storedDoctorInfo);
        setDoctorInfo(parsedDoctorInfo);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('patientInfo');
      localStorage.removeItem('doctorInfo');
    }
  }, []);

  const login = async (data) => {
    try {
      console.log('Login data received:', data);
      
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user?.role === 'PATIENT' && data.patient) {
        setPatientInfo(data.patient);
        localStorage.setItem('patientInfo', JSON.stringify(data.patient));
      } else if (data.user?.role === 'DOCTOR' && data.doctor) {
        setDoctorInfo(data.doctor);
        localStorage.setItem('doctorInfo', JSON.stringify(data.doctor));
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear the token from localStorage
      localStorage.removeItem('token');
      
      // Clear any other auth-related data
      setUser(null);
      setIsAuthenticated(false);

      // Optional: Call your backend logout endpoint
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if server logout fails
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    patientInfo,
    doctorInfo,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export { AuthProvider, useAuth };


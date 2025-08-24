import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUserMd, FaUser, FaCalendar, FaFileAlt } from 'react-icons/fa';
import styles from './GlobalSearch.module.css';

const GlobalSearch = ({ onMenuItemClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const performSearch = async (query) => {
    try {
      setIsSearching(true);
      setSearchError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search/globalSearch?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      // Transform the SearchResult object into a flat array of results
      const formattedResults = [
        ...data.patients.map(patient => ({
          id: patient.id,
          type: 'patient',
          name: patient.name,
          details: `Email: ${patient.email} | Phone: ${patient.phone}`
        })),
        ...data.doctors.map(doctor => ({
          id: doctor.id,
          type: 'doctor',
          name: doctor.name,
          details: `${doctor.specialization} | License: ${doctor.licenseNumber}`
        })),
        ...data.appointments.map(appointment => ({
          id: appointment.id,
          type: 'appointment',
          name: `Appointment on ${appointment.appointmentDate}`,
          details: `Status: ${appointment.status} | ${appointment.notes || ''}`
        })),
        ...data.medicalRecords.map(record => ({
          id: record.id,
          type: 'record',
          name: record.condition,
          details: `Treatment: ${record.treatment}`
        }))
      ];

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to perform search');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (result) => {
    switch (result.type) {
      case 'doctor':
        onMenuItemClick('doctors');
        break;
      case 'patient':
        onMenuItemClick('patients');
        break;
      case 'appointment':
        onMenuItemClick('appointments');
        break;
      case 'record':
        onMenuItemClick('results');
        break;
      default:
        break;
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'doctor':
        return <FaUserMd />;
      case 'patient':
        return <FaUser />;
      case 'appointment':
        return <FaCalendar />;
      case 'record':
        return <FaFileAlt />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.globalSearch}>
      <div className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search patients, doctors, appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {isSearching && (
        <div className={styles.searchLoading}>
          <div className={styles.spinner}></div>
          Searching...
        </div>
      )}

      {searchError && (
        <div className={styles.searchError}>
          {searchError}
        </div>
      )}

      {searchTerm.length >= 2 && !isSearching && !searchError && (
        <div className={styles.searchResults}>
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className={styles.searchResult}
                onClick={() => handleSearchResultClick(result)}
              >
                <div className={styles.resultIcon}>
                  {getResultIcon(result.type)}
                </div>
                <div className={styles.resultInfo}>
                  <div className={styles.resultName}>{result.name}</div>
                  <div className={styles.resultType}>
                    {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </div>
                  {result.details && (
                    <div className={styles.resultDetails}>
                      {result.details}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                <FaSearch />
              </div>
              <p>No results found for "{searchTerm}"</p>
              <span>Try different keywords or check spelling</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
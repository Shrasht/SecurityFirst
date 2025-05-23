import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { AuthContext } from '../context/AuthContext';
import { LocationContext } from '../context/LocationContext';
import { FaMapMarkedAlt, FaStar } from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { 
    currentLocation, 
    savedPlaces, 
    isLocationSharing,
    toggleLocationSharing 
  } = useContext(LocationContext);
  
  const [quickActions] = useState([
    { id: 1, name: 'Emergency SOS', icon: '🆘', color: '#ff5252', action: () => alert('Emergency SOS triggered') },
    { id: 2, name: 'Share Location', icon: '📍', color: '#7c4dff', action: toggleLocationSharing },
    { id: 3, name: 'Safe Routes', icon: '🛣️', color: '#00bcd4', link: '/safe-routes' },
  ]);

  // Safety tips carousel
  const safetyTips = [
    "Always keep your phone charged and carry a power bank.",
    "Share your location with trusted contacts when traveling alone.",
    "Stay in well-lit areas at night and avoid shortcuts through isolated places.",
    "Trust your instincts. If something feels wrong, leave the situation immediately.",
    "Program emergency numbers for quick access on your phone."
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeSection}>
        <h1>Welcome back, {currentUser?.name || 'User'}!</h1>
        <p className={isLocationSharing ? styles.sharingActive : ''}>
          {isLocationSharing 
            ? 'Location sharing is active' 
            : 'Your location sharing is currently paused'}
        </p>
      </div>

      <div className={styles.quickActions}>
        {quickActions.map(action => (
          action.link ? (
            <Link to={action.link} key={action.id} className={styles.actionCard} style={{ backgroundColor: action.color }}>
              <div className={styles.actionIcon}>{action.icon}</div>
              <span>{action.name}</span>
            </Link>
          ) : (
            <div 
              key={action.id} 
              className={`${styles.actionCard} ${action.name === 'Share Location' && isLocationSharing ? styles.active : ''}`} 
              style={{ backgroundColor: action.color }}
              onClick={action.action}
            >
              <div className={styles.actionIcon}>{action.icon}</div>
              <span>{action.name === 'Share Location' ? (isLocationSharing ? 'Stop Sharing' : 'Share Location') : action.name}</span>
            </div>
          )
        ))}
      </div>

      <div className={styles.mapSection}>
        <h2 className={styles.sectionTitle}>Your Location</h2>
        <div className={styles.mapContainer}>
          {currentLocation ? (
            <div className={styles.mapPlaceholder}>
              <FaMapMarkedAlt />
              <p>Map would display here with your current location</p>
            </div>
          ) : (
            <div className={styles.mapPlaceholder}>
              <FaMapMarkedAlt />
              <p>Loading your location...</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.twoColumnLayout}>
        <div className={styles.column}>
          <div className={styles.weatherWidget}>
            <h3>Weather Information</h3>
            <div className={styles.weatherContent}>
              <div className={styles.weatherIcon}>☀️</div>
              <div className={styles.weatherDetails}>
                <p className={styles.temperature}>24°C</p>
                <p>Sunny</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.safetyTipCard}>
            <h3>Safety Tip</h3>
            <p>{safetyTips[0]}</p>
          </div>
        </div>
      </div>

      <div className={styles.savedPlacesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Favorite Places</h2>
          <Link to="/saved-places" className={styles.viewAllLink}>View All</Link>
        </div>
        <div className={styles.savedPlacesGrid}>
          {savedPlaces.length > 0 ? savedPlaces.slice(0, 3).map(place => (
            <div key={place.id} className={styles.placeCard}>
              <div className={styles.placeIcon}><FaStar /></div>
              <div className={styles.placeDetails}>
                <h3>{place.name}</h3>
                <p>{place.address}</p>
              </div>
            </div>
          )) : (
            <p>No saved places yet. Add your first favorite place!</p>
          )}
          <Link to="/saved-places" className={styles.addPlaceCard}>
            <div className={styles.addIcon}>+</div>
            <span>Add New Place</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

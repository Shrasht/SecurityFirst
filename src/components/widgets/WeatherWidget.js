import React, { useState, useEffect, useContext } from 'react';
import { LocationContext } from '../../context/LocationContext';
import styles from './WeatherWidget.module.css';
import { FaCloud, FaSun, FaCloudRain, FaSnowflake, FaCloudSun, FaBolt, FaWind } from 'react-icons/fa';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentLocation } = useContext(LocationContext);
  
  useEffect(() => {
    const fetchWeather = async () => {
      if (!currentLocation) return;
      
      try {
        setLoading(true);
        
        // In a real app, fetch from a weather API
        // For demo, we'll simulate a weather response
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockWeather = {
          temp: Math.floor(Math.random() * 15) + 15, // 15-30°C
          condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Windy'][Math.floor(Math.random() * 5)],
          humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
          windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        };
        
        setWeather(mockWeather);
        setLoading(false);
      } catch (err) {
        setError('Failed to load weather data');
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [currentLocation]);
  
  const getWeatherIcon = (condition) => {
    switch(condition?.toLowerCase()) {
      case 'sunny': return <FaSun />;
      case 'cloudy': return <FaCloud />;
      case 'partly cloudy': return <FaCloudSun />;
      case 'rainy': return <FaCloudRain />;
      case 'stormy': return <FaBolt />;
      case 'snowy': return <FaSnowflake />;
      case 'windy': return <FaWind />;
      default: return <FaCloud />;
    }
  };

  if (loading) {
    return (
      <div className={styles.weatherCard}>
        <div className={styles.loadingWeather}>
          <div className={styles.loadingAnimation}></div>
          <p>Loading weather...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.weatherCard}>
        <div className={styles.errorWeather}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.weatherCard}>
      <h3 className={styles.cardTitle}>Weather</h3>
      <div className={styles.weatherInfo}>
        <div className={styles.weatherMain}>
          <div className={styles.weatherIcon}>
            {getWeatherIcon(weather?.condition)}
          </div>
          <div className={styles.tempContainer}>
            <span className={styles.temperature}>{weather?.temp}°</span>
            <span className={styles.unit}>C</span>
          </div>
        </div>
        <div className={styles.weatherDetails}>
          <div className={styles.weatherCondition}>{weather?.condition}</div>
          <div className={styles.weatherStats}>
            <span>Humidity: {weather?.humidity}%</span>
            <span>Wind: {weather?.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;

import React from "react";
import styles from "./RouteCard.module.css";
import {
  FaRoute,
  FaClock,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const RouteCard = ({ route, isSelected, onSelect, isHighlighted = false }) => {
  // Function to get safety class based on score
  const getSafetyClass = (score) => {
    if (score >= 80) return styles.safe;
    if (score >= 60) return styles.moderate;
    return styles.unsafe;
  };

  // Function to get safety icon based on score
  const getSafetyIcon = (score) => {
    if (score >= 80) return <FaCheckCircle />;
    if (score >= 60) return <FaExclamationTriangle />;
    return <FaTimesCircle />;
  };

  // Detailed analysis descriptions
  const getAnalysisDescription = (key, value) => {
    switch (key) {
      case "wellLit":
        return value ? "Well-lit route" : "Poorly lit areas";
      case "crowdedness":
        return `${value} population density`;
      case "policeProximity":
        return `${value} proximity to police`;
      case "historicalIncidents":
        return `${value} historical incidents`;
      case "timeOfDayRisk":
        return `${value} risk factor for current time`;
      default:
        return `${key}: ${value}`;
    }
  };
  return (
    <div
      className={`${styles.routeCard} ${isSelected ? styles.selected : ""} ${
        isHighlighted ? styles.highlighted : ""
      }`}
      onClick={onSelect}
    >
      {isHighlighted && (
        <div className={styles.safestBadge}>
          <FaShieldAlt /> SAFEST ROUTE
        </div>
      )}
      <div className={styles.routeHeader}>
        <div className={styles.routeName}>{route.name}</div>
        <div
          className={`${styles.safetyBadge} ${getSafetyClass(
            route.safetyScore
          )}`}
        >
          {getSafetyIcon(route.safetyScore)} {route.safetyScore}%
        </div>
      </div>

      <div className={styles.routeInfo}>
        <div className={styles.infoItem}>
          <FaRoute /> <span>{route.distance}</span>
        </div>
        <div className={styles.infoItem}>
          <FaClock /> <span>{route.duration}</span>
        </div>
      </div>

      {route.safetyAnalysis && (
        <div className={styles.safetyAnalysis}>
          <h4 className={styles.analysisTitle}>
            <FaShieldAlt /> AI Safety Analysis
          </h4>
          <ul className={styles.analysisList}>
            {Object.entries(route.safetyAnalysis).map(([key, value], index) => (
              <li key={index} className={styles.analysisItem}>
                {getAnalysisDescription(key, value)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className={styles.selectButton}>
        {isSelected ? "Selected" : "Select Route"}
      </button>
    </div>
  );
};

export default RouteCard;

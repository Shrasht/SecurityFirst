import React from "react";
import styles from "./HelpPointsPanel.module.css";
import {
  FaShieldAlt,
  FaHospital,
  FaHome,
  FaPrescriptionBottleAlt,
  FaLightbulb,
  FaPhoneAlt,
  FaDirections,
} from "react-icons/fa";

const HelpPointsPanel = ({ helpPoints }) => {
  // Icons for different types of help points
  const getHelpIcon = (type) => {
    switch (type) {
      case "police":
        return <FaShieldAlt className={styles.policeIcon} />;
      case "hospital":
        return <FaHospital className={styles.hospitalIcon} />;
      case "shelter":
        return <FaHome className={styles.shelterIcon} />;
      case "pharmacy":
        return <FaPrescriptionBottleAlt className={styles.pharmacyIcon} />;
      case "lit-area":
        return <FaLightbulb className={styles.litAreaIcon} />;
      default:
        return <FaShieldAlt />;
    }
  };

  // Group help points by type
  const groupedPoints = helpPoints.reduce((acc, point) => {
    if (!acc[point.type]) {
      acc[point.type] = [];
    }
    acc[point.type].push(point);
    return acc;
  }, {});

  // Type labels
  const typeLabels = {
    police: "Police Stations",
    hospital: "Hospitals",
    shelter: "Shelters",
    pharmacy: "Pharmacies",
    "lit-area": "Well-lit Areas",
  };

  return (
    <div className={styles.helpPointsPanel}>
      <h3 className={styles.panelTitle}>
        <FaShieldAlt /> Nearby Safety Resources
      </h3>

      <div className={styles.pointsContainer}>
        {Object.entries(groupedPoints).map(([type, points]) => (
          <div key={type} className={styles.pointsGroup}>
            <h4 className={styles.groupTitle}>
              {getHelpIcon(type)} {typeLabels[type] || type}
            </h4>

            <ul className={styles.pointsList}>
              {points.map((point) => (
                <li key={point.id} className={styles.helpPoint}>
                  <div className={styles.pointInfo}>
                    <div className={styles.pointName}>{point.name}</div>
                    <div className={styles.pointDistance}>{point.distance}</div>
                  </div>

                  <div className={styles.pointActions}>
                    <button className={styles.actionButton}>
                      <FaPhoneAlt /> Call
                    </button>
                    <button className={styles.actionButton}>
                      <FaDirections /> Route
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.emergencyButton}>
        <button>Emergency SOS</button>
      </div>
    </div>
  );
};

export default HelpPointsPanel;

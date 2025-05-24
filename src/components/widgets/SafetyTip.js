import React, { useState, useEffect } from "react";
import styles from "./SafetyTip.module.css";
import { FaLightbulb, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const SafetyTip = ({ tips = [] }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Auto-rotate tips every 10 seconds
  useEffect(() => {
    if (!tips || tips.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [tips]);

  const goToPrevTip = () => {
    setCurrentTipIndex((prevIndex) => {
      if (prevIndex === 0) return tips.length - 1;
      return prevIndex - 1;
    });
  };

  const goToNextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
  };

  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <div className={styles.safetyTipCard}>
      <h3 className={styles.cardTitle}>Safety Tip</h3>
      <div className={styles.tipContent}>
        <div className={styles.tipIconContainer}>
          <FaLightbulb className={styles.tipIcon} />
        </div>
        <p className={styles.tipText}>{tips[currentTipIndex]}</p>
      </div>

      {tips.length > 1 && (
        <div className={styles.tipControls}>
          <button className={styles.tipButton} onClick={goToPrevTip}>
            <FaArrowLeft />
          </button>
          <div className={styles.tipIndicators}>
            {tips.map((_, index) => (
              <span
                key={index}
                className={`${styles.tipIndicator} ${
                  index === currentTipIndex ? styles.active : ""
                }`}
              />
            ))}
          </div>
          <button className={styles.tipButton} onClick={goToNextTip}>
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default SafetyTip;

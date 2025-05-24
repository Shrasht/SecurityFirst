import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { AuthContext } from "../context/AuthContext";
import { LocationContext } from "../context/LocationContext";
import {
  FaMapMarkedAlt,
  FaStar,
  FaShieldAlt,
  FaClock,
  FaRoute,
  FaUserShield,
  FaPhoneAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaMapPin,
} from "react-icons/fa";
import EmergencyNotification from "../components/safety/EmergencyNotification";
import EmergencyContacts from "../components/safety/EmergencyContacts";
import ShareLocation from "../components/safety/ShareLocation";
import HereMap from "../components/map/HereMap";
import MapWithRoutePlanner from "../components/map/MapWithRoutePlanner";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    currentLocation,
    savedPlaces,
    isLocationSharing,
    toggleLocationSharing,
  } = useContext(LocationContext);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showShareLocation, setShowShareLocation] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  // Quick action cards with enhanced functionality
  const [quickActions] = useState([
    {
      id: 1,
      name: "Emergency Alert",
      description: "Instant SOS to all contacts",
      icon: <FaExclamationTriangle />,
      color: "#ff4444",
      textColor: "#fff",
      link: "/emergency-alert",
      priority: "high",
    },
    {
      id: 2,
      name: "Share Location",
      description: "Share your location via email with trusted contacts",
      icon: <FaMapPin />,
      color: "#2196f3",
      textColor: "#fff",
      action: () => setShowShareLocation(true),
      priority: "medium",
    },
    {
      id: 3,
      name: isLocationSharing ? "Stop Tracking" : "Live Tracking",
      description: isLocationSharing
        ? "Currently tracking live location"
        : "Enable continuous location tracking",
      icon: <FaMapPin />,
      color: isLocationSharing ? "#4caf50" : "#ff9800",
      textColor: "#fff",
      action: toggleLocationSharing,
      priority: "medium",
    },
    {
      id: 4,
      name: "Safe Routes",
      description: "Find the safest path to your destination",
      icon: <FaRoute />,
      color: "#00bcd4",
      textColor: "#fff",
      link: "/safe-routes",
      priority: "medium",
    },
    {
      id: 5,
      name: "Safety Profile",
      description: "Manage your safety settings",
      icon: <FaUserShield />,
      color: "#9c27b0",
      textColor: "#fff",
      link: "/profile",
      priority: "low",
    },
  ]);

  // Enhanced safety tips with categories
  const safetyTips = [
    {
      category: "Travel",
      tip: "Always keep your phone charged and carry a power bank when traveling.",
      icon: "🔋",
    },
    {
      category: "Location",
      tip: "Share your location with trusted contacts when traveling alone.",
      icon: "📍",
    },
    {
      category: "Night Safety",
      tip: "Stay in well-lit areas at night and avoid shortcuts through isolated places.",
      icon: "🌙",
    },
    {
      category: "Emergency",
      tip: "Trust your instincts. If something feels wrong, leave the situation immediately.",
      icon: "⚠️",
    },
    {
      category: "Preparation",
      tip: "Program emergency numbers for quick access on your phone.",
      icon: "📞",
    },
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Rotate safety tips every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % safetyTips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [safetyTips.length]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      type: "route",
      description: "Completed safe route to Downtown",
      time: "2 hours ago",
      icon: <FaCheckCircle className={styles.activityIcon} />,
    },
    {
      id: 2,
      type: "sharing",
      description: "Location shared with Emma for 45 minutes",
      time: "5 hours ago",
      icon: <FaMapPin className={styles.activityIcon} />,
    },
    {
      id: 3,
      type: "safety",
      description: "Safety check completed successfully",
      time: "1 day ago",
      icon: <FaShieldAlt className={styles.activityIcon} />,
    },
  ];
  const [activeTab, setActiveTab] = useState("emergency");
  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeSection}>
        <h1>Welcome back, {currentUser?.name || "User"}!</h1>
        <p className={isLocationSharing ? styles.sharingActive : ""}>
          {isLocationSharing ? (
            <>
              <span className={styles.statusIndicator}></span>
              Location sharing is active
            </>
          ) : (
            "Your location sharing is currently paused"
          )}
        </p>
      </div>
      <div className={styles.emergencySection}>
        {/* <div className={styles.emergencyTabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "emergency" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("emergency")}
          >
            Send Emergency Alert
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "contacts" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("contacts")}
          >
            Manage Contacts
          </button>
        </div> */}

        {/* <div className={styles.tabContent}>
          {activeTab === "emergency" ? (
            <EmergencyNotification />
          ) : (
            <EmergencyContacts />
          )}
        </div> */}
      </div>
      <div className={styles.quickActions}>
        {quickActions.map((action) =>
          action.link ? (
            <Link
              to={action.link}
              key={action.id}
              className={styles.actionCard}
              style={{ backgroundColor: action.color }}
            >
              <div className={styles.actionIcon}>{action.icon}</div>
              <span>{action.name}</span>
            </Link>
          ) : (
            <div
              key={action.id}
              className={`${styles.actionCard} ${
                action.name === "Live Tracking" && isLocationSharing
                  ? styles.active
                  : ""
              }`}
              style={{ backgroundColor: action.color }}
              onClick={action.action}
            >
              <div className={styles.actionIcon}>{action.icon}</div>
              <span>
                {action.name === "Live Tracking"
                  ? isLocationSharing
                    ? "Stop Tracking"
                    : "Live Tracking"
                  : action.name}
              </span>
            </div>
          )
        )}
      </div>{" "}
      <div className={styles.mapSection}>
        <h2 className={styles.sectionTitle}>
          Interactive Route Planner
          {isLocationSharing && (
            <span className={styles.liveIndicator}>LIVE</span>
          )}
        </h2>{" "}
        <div className={styles.mapContainer}>
          {currentLocation ? (
            <MapWithRoutePlanner height="950px" />
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
        </div>{" "}
        <div className={styles.column}>
          <div className={styles.safetyTipCard}>
            <h3>Safety Tip</h3>
            <div className={styles.tipContent}>
              <span className={styles.tipIcon}>
                {safetyTips[currentTipIndex].icon}
              </span>
              <p>{safetyTips[currentTipIndex].tip}</p>
              <span className={styles.tipCategory}>
                {safetyTips[currentTipIndex].category}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.savedPlacesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Favorite Places</h2>
          <Link to="/saved-places" className={styles.viewAllLink}>
            View All
          </Link>
        </div>
        <div className={styles.savedPlacesGrid}>
          {savedPlaces.length > 0 ? (
            savedPlaces.slice(0, 3).map((place) => (
              <div key={place.id} className={styles.placeCard}>
                <div className={styles.placeIcon}>
                  <FaStar />
                </div>
                <div className={styles.placeDetails}>
                  <h3>{place.name}</h3>
                  <p>{place.address}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No saved places yet. Add your first favorite place!</p>
          )}
          <Link to="/saved-places" className={styles.addPlaceCard}>
            <div className={styles.addIcon}>+</div>
            <span>Add New Place</span>
          </Link>
        </div>
      </div>
      {/* Share Location Modal */}
      <ShareLocation
        isOpen={showShareLocation}
        onClose={() => setShowShareLocation(false)}
      />
    </div>
  );
};

export default Dashboard;

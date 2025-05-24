import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./BottomNav.module.css";
import { FaHome, FaMap, FaStar, FaHistory, FaUser } from "react-icons/fa";
import { LocationContext } from "../../context/LocationContext";

const BottomNav = () => {
  const location = useLocation();
  const { isLocationSharing, toggleLocationSharing } =
    useContext(LocationContext);

  return (
    <nav className={styles.bottomNav}>
      <Link
        to="/dashboard"
        className={`${styles.navItem} ${
          location.pathname === "/dashboard" ? styles.active : ""
        }`}
      >
        <FaHome />
        <span>Home</span>
      </Link>

      <Link
        to="/safe-routes"
        className={`${styles.navItem} ${
          location.pathname === "/safe-routes" ? styles.active : ""
        }`}
      >
        <FaMap />
        <span>Routes</span>
      </Link>

      <div
        className={`${styles.navItemCenter} ${
          isLocationSharing ? styles.sharing : ""
        }`}
        onClick={toggleLocationSharing}
      >
        <div className={styles.shareButton}>
          {isLocationSharing ? "Stop" : "Share"}
        </div>
      </div>

      <Link
        to="/saved-places"
        className={`${styles.navItem} ${
          location.pathname === "/saved-places" ? styles.active : ""
        }`}
      >
        <FaStar />
        <span>Places</span>
      </Link>

      <Link
        to="/profile"
        className={`${styles.navItem} ${
          location.pathname === "/profile" ? styles.active : ""
        }`}
      >
        <FaUser />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;

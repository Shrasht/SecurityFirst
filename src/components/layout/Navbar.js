import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Navbar.module.css';
import { FaUserCircle, FaBars, FaTimes, FaBell } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🛡️</span>
          <span className={styles.logoText}>SafetyFirst</span>
        </Link>

        <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`${styles.navMenu} ${menuOpen ? styles.active : ''}`}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className={styles.navItem}>
                <Link to="/dashboard" className={styles.navLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/safe-routes" className={styles.navLink} onClick={() => setMenuOpen(false)}>Safe Routes</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/saved-places" className={styles.navLink} onClick={() => setMenuOpen(false)}>Saved Places</Link>
              </li>
              <li className={styles.navNotification}>
                <FaBell />
              </li>
              <li className={styles.navProfile}>
                {currentUser?.profilePic ? (
                  <img 
                    src={currentUser.profilePic} 
                    alt={currentUser.name} 
                    className={styles.profilePic} 
                  />
                ) : (
                  <FaUserCircle />
                )}
                <div className={styles.profileDropdown}>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
                  <Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className={styles.navItem}>
                <Link to="/login" className={styles.navLink} onClick={() => setMenuOpen(false)}>Login</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/register" className={`${styles.navLink} ${styles.btnRegister}`} onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

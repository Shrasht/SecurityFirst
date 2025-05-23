import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { FaShieldAlt, FaMapMarkedAlt, FaBell, FaRoute, FaStar } from 'react-icons/fa';

const Home = () => {
  return (
    <div className={styles.homePage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Stay Safe Wherever You Go</h1>
          <p>
            SafetyFirst helps you navigate safely with real-time location tracking, 
            safe route suggestions, and instant alerts to your trusted contacts.
          </p>
          <div className={styles.heroCta}>
            <Link to="/register" className={`${styles.ctaButton} ${styles.primaryButton}`}>
              Get Started
            </Link>
            <Link to="/login" className={`${styles.ctaButton} ${styles.secondaryButton}`}>
              Sign In
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          {/* Image placeholder */}
          <div className={styles.imagePlaceholder}>
            <FaShieldAlt />
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h2>Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaMapMarkedAlt />
            </div>
            <h3>Real-Time Location Tracking</h3>
            <p>Share your location with trusted contacts in real-time for added safety.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaRoute />
            </div>
            <h3>Safe Route Suggestions</h3>
            <p>Get recommendations for safer routes based on real-time safety data.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaBell />
            </div>
            <h3>Emergency Alerts</h3>
            <p>Send instant SOS alerts with your location to emergency contacts.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaStar />
            </div>
            <h3>Saved Places</h3>
            <p>Mark and save your frequent destinations for quick access.</p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorksSection}>
        <h2>How It Works</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Create an Account</h3>
            <p>Sign up with your email and set up your safety profile.</p>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Add Emergency Contacts</h3>
            <p>Add trusted friends and family who can be notified in emergencies.</p>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Share Your Location</h3>
            <p>Enable location sharing when you need others to know where you are.</p>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Stay Protected</h3>
            <p>Use the app's features whenever you're traveling or feel unsafe.</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to Feel Safer?</h2>
          <p>Join thousands of users who trust SafetyFirst for their personal safety.</p>
          <Link to="/register" className={`${styles.ctaButton} ${styles.primaryButton}`}>
            Download Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

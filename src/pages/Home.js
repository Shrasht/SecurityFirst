import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import {
  FaShieldAlt,
  FaMapMarkedAlt,
  FaBell,
  FaRoute,
  FaStar,
  FaPlay,
  FaCheckCircle,
  FaUsers,
  FaAward,
  FaPhoneAlt,
  FaArrowRight,
  FaQuoteLeft,
} from "react-icons/fa";

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "College Student",
      text: "SafetyFirst gives me peace of mind when walking home late from campus. My parents can track my location and I feel so much safer.",
      avatar: "👩‍🎓",
    },
    {
      name: "Michael Rodriguez",
      role: "Business Traveler",
      text: "As someone who travels frequently for work, this app is a lifesaver. The safe route suggestions have helped me avoid unsafe areas.",
      avatar: "👨‍💼",
    },
    {
      name: "Emma Thompson",
      role: "Mother of Two",
      text: "I use this to keep track of my teenage daughter. The emergency alerts work perfectly and give us both confidence.",
      avatar: "👩‍👧",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: <FaUsers /> },
    { number: "50K+", label: "Safe Journeys", icon: <FaRoute /> },
    { number: "99.9%", label: "Uptime", icon: <FaAward /> },
    { number: "24/7", label: "Support", icon: <FaPhoneAlt /> },
  ];

  // Rotate testimonials every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gradientOrb3}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <FaShieldAlt />
              <span>Trusted by 10,000+ users</span>
            </div>
            <h1>
              Stay <span className={styles.highlight}>Safe</span>
              <br />
              Wherever You Go
            </h1>
            <p>
              Advanced personal safety technology that connects you with loved
              ones, provides intelligent route guidance, and ensures help is
              always within reach.
            </p>
            <div className={styles.heroCta}>
              <Link
                to="/register"
                className={`${styles.ctaButton} ${styles.primaryButton}`}
              >
                <span>Get Started Free</span>
                <FaArrowRight />
              </Link>
              <Link
                to="/login"
                className={`${styles.ctaButton} ${styles.secondaryButton}`}
              >
                <FaPlay />
                <span>Watch Demo</span>
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.phoneFrame}>
              <div className={styles.screen}>
                <div className={styles.mockApp}>
                  <div className={styles.statusBar}></div>
                  <div className={styles.appHeader}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}></div>
                      <div className={styles.greeting}>
                        <span>Good evening, Sarah</span>
                        <div className={styles.statusDot}></div>
                        <span>Location sharing active</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.quickActions}>
                    <div className={`${styles.actionBtn} ${styles.emergency}`}>
                      SOS
                    </div>
                    <div className={styles.actionBtn}>Route</div>
                    <div className={styles.actionBtn}>Share</div>
                  </div>
                  <div className={styles.mapPreview}></div>
                </div>
              </div>
            </div>
            <div className={styles.floatingElements}>
              <div
                className={styles.floatingCard}
                style={{ animationDelay: "0s" }}
              >
                <FaBell />
                <span>Alert sent</span>
              </div>
              <div
                className={styles.floatingCard}
                style={{ animationDelay: "1s" }}
              >
                <FaMapMarkedAlt />
                <span>Safe route found</span>
              </div>
              <div
                className={styles.floatingCard}
                style={{ animationDelay: "2s" }}
              >
                <FaCheckCircle />
                <span>Journey completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={styles.statCard}
              data-animate
              id={`stat-${index}`}
            >
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
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
            <p>
              Share your location with trusted contacts in real-time for added
              safety.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaRoute />
            </div>
            <h3>Safe Route Suggestions</h3>
            <p>
              Get recommendations for safer routes based on real-time safety
              data.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FaBell />
            </div>
            <h3>Emergency Alerts</h3>
            <p>
              Send instant SOS alerts with your location to emergency contacts.
            </p>
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
            <p>
              Add trusted friends and family who can be notified in emergencies.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Share Your Location</h3>
            <p>
              Enable location sharing when you need others to know where you
              are.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Stay Protected</h3>
            <p>
              Use the app's features whenever you're traveling or feel unsafe.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to Feel Safer?</h2>
          <p>
            Join thousands of users who trust SafetyFirst for their personal
            safety.
          </p>
          <Link
            to="/register"
            className={`${styles.ctaButton} ${styles.primaryButton}`}
          >
            Download Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

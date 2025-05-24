import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthPages.module.css";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setFormError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      const user = await register(formData);
      if (user) {
        navigate("/dashboard");
      } else {
        setFormError("Registration failed. Please try again.");
      }
    } catch (error) {
      setFormError("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2>Create Account</h2>
          <p>Join SafetyFirst to stay protected</p>
        </div>

        {formError && <div className={styles.errorMessage}>{formError}</div>}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <div className={styles.inputWithIcon}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputWithIcon}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWithIcon}>
              <FaLock className={styles.inputIcon} />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.inputWithIcon}>
              <FaLock className={styles.inputIcon} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.authButton}
            disabled={loading}
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Sign Up <FaUserPlus />
              </>
            )}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

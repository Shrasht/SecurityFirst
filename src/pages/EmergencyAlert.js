import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./EmergencyAlert.module.css";
import EmergencyNotification from "../components/safety/EmergencyNotification";
import EmergencyContacts from "../components/safety/EmergencyContacts";
import { FaArrowLeft, FaBell, FaAddressBook } from "react-icons/fa";

const EmergencyAlert = () => {
  const [activeTab, setActiveTab] = useState("notification");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/dashboard" className={styles.backLink}>
          <FaArrowLeft /> <span>Back to Dashboard</span>
        </Link>
        <h1 className={styles.title}>Emergency Alert System</h1>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "notification" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("notification")}
          >
            <FaBell className={styles.tabIcon} /> Send Alert
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "contacts" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("contacts")}
          >
            <FaAddressBook className={styles.tabIcon} /> Manage Contacts
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "notification" ? (
            <div className={styles.notificationSection}>
              <p className={styles.description}>
                Send emergency alerts to your trusted contacts with your current
                location and a customized message for immediate assistance.
              </p>
              <EmergencyNotification />
            </div>
          ) : (
            <div className={styles.contactsSection}>
              <p className={styles.description}>
                Add and manage your emergency contacts who will be notified when
                you send an alert. You can add both email and phone contacts.
              </p>
              <EmergencyContacts />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;

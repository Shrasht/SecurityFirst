import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LocationContext } from "../../context/LocationContext";
import EmergencyService from "../../services/EmergencyService";
import styles from "./EmergencyNotification.module.css";
import {
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaMap,
  FaMapMarkedAlt,
  FaEnvelope,
  FaSms,
  FaInfoCircle,
} from "react-icons/fa";

const EmergencyNotification = () => {
  const { currentUser } = useContext(AuthContext);
  const { currentLocation } = useContext(LocationContext);

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });
  const [notificationType, setNotificationType] = useState("all"); // 'email', 'sms', 'all'
  const [message, setMessage] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [includeMap, setIncludeMap] = useState(true);
  const [mapPreviewUrl, setMapPreviewUrl] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);

  const contacts = currentUser?.emergencyContacts || [];

  // When contacts change, update selectedContacts
  useEffect(() => {
    if (contacts.length > 0) {
      setSelectedContacts(contacts.map((contact) => contact.id));
    } else {
      setSelectedContacts([]);
    }
  }, [contacts]);

  // Generate map preview URL when location changes or includeMap is toggled
  useEffect(() => {
    if (currentLocation && includeMap) {
      const previewUrl = EmergencyService.generateStaticMapUrl(
        currentLocation,
        300,
        200
      );
      setMapPreviewUrl(previewUrl);
    } else {
      setMapPreviewUrl("");
    }
  }, [currentLocation, includeMap]);

  // Initialize EmailJS when component mounts - without returning a cleanup function
  useEffect(() => {
    // Initialize EmailJS only once when component mounts
    EmergencyService.initEmailJS();
    // Don't return a cleanup function
  }, []);

  // Toggle selection of a contact
  const toggleContactSelection = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };
  // Handle sending notification
  const handleSendNotification = async () => {
    if (selectedContacts.length === 0) {
      setStatus({
        loading: false,
        success: false,
        error: "Please select at least one contact",
      });
      return;
    }

    if (!currentLocation) {
      setStatus({
        loading: false,
        success: false,
        error: "Location is unavailable. Please enable location services.",
      });
      return;
    }

    const selectedContactDetails = contacts.filter((contact) =>
      selectedContacts.includes(contact.id)
    );

    if (selectedContactDetails.length === 0) {
      setStatus({
        loading: false,
        success: false,
        error: "No valid contacts selected",
      });
      return;
    }

    // Check if selected contacts have email addresses for email notifications
    if (
      (notificationType === "email" || notificationType === "all") &&
      !selectedContactDetails.some((contact) => contact.email)
    ) {
      setStatus({
        loading: false,
        success: false,
        error:
          "Selected contacts don't have email addresses for email notification",
      });
      return;
    }

    // Check if selected contacts have phone numbers for SMS notifications
    if (
      (notificationType === "sms" || notificationType === "all") &&
      !selectedContactDetails.some((contact) => contact.phone)
    ) {
      setStatus({
        loading: false,
        success: false,
        error:
          "Selected contacts don't have phone numbers for SMS notification",
      });
      return;
    }

    // Validate email formats before sending
    const invalidEmails = selectedContactDetails
      .filter(
        (contact) =>
          contact.email && !EmergencyService.isValidEmail(contact.email)
      )
      .map((contact) => contact.email);

    if (invalidEmails.length > 0) {
      setStatus({
        loading: false,
        success: false,
        error: `Some emails have invalid format: ${invalidEmails.join(", ")}`,
      });
      return;
    }

    // Prepare user info and location data with more details
    const userInfo = {
      name: currentUser.name || "Emergency Contact",
      id: currentUser.id,
      email: currentUser.email || "",
      message: message || "I need help! This is an emergency notification.",
      phone: currentUser.phone || "Not provided",
    };

    const locationData = {
      ...currentLocation,
      googleMapsUrl: `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`,
      address: currentLocation.address || "Unknown location",
      timestamp: new Date().toISOString(),
    };

    setStatus({ loading: true, success: false, error: null });

    try {
      console.log("Starting emergency notification...");
      console.log("Selected contacts:", selectedContactDetails);
      console.log("Notification type:", notificationType);
      console.log("User info:", userInfo);
      console.log("Location data:", locationData);

      let result;

      switch (notificationType) {
        case "email":
          console.log("Sending email notifications...");
          if (includeMap) {
            result = await EmergencyService.sendEmailNotificationWithMap(
              selectedContactDetails,
              userInfo,
              locationData
            );
          } else {
            result = await EmergencyService.sendEmailNotification(
              selectedContactDetails,
              userInfo,
              locationData
            );
          }
          setEmailStatus(result);
          break;
        case "sms":
          console.log("Sending SMS notifications...");
          result = await EmergencyService.sendSMSNotification(
            selectedContactDetails,
            userInfo,
            locationData
          );
          break;
        case "all":
        default:
          console.log("Sending both email and SMS notifications...");
          // For "all", send email with map and regular SMS
          const emailContacts = selectedContactDetails.filter(
            (contact) => contact.email
          );
          const smsContacts = selectedContactDetails.filter(
            (contact) => contact.phone
          );

          const emailPromise =
            emailContacts.length > 0
              ? includeMap
                ? EmergencyService.sendEmailNotificationWithMap(
                    emailContacts,
                    userInfo,
                    locationData
                  )
                : EmergencyService.sendEmailNotification(
                    emailContacts,
                    userInfo,
                    locationData
                  )
              : Promise.resolve({
                  success: true,
                  message: "No email contacts",
                  emailsSent: [],
                });

          const smsPromise =
            smsContacts.length > 0
              ? EmergencyService.sendSMSNotification(
                  smsContacts,
                  userInfo,
                  locationData
                )
              : Promise.resolve({
                  success: true,
                  message: "No SMS contacts",
                  smsSent: [],
                });

          const [emailResult, smsResult] = await Promise.all([
            emailPromise,
            smsPromise,
          ]);

          setEmailStatus(emailResult);

          result = {
            email: emailResult,
            sms: smsResult,
            success: emailResult.success || smsResult.success,
            message: `Notifications sent: ${
              emailResult.emailsSent?.length || 0
            } emails, ${smsResult.smsSent?.length || 0} SMS`,
          };
          break;
      }

      console.log("Notification result:", result);

      if (result.success) {
        setStatus({ loading: false, success: true, error: null });
        // Reset success message after 10 seconds
        setTimeout(() => {
          setStatus({ loading: false, success: false, error: null });
          setEmailStatus(null);
        }, 10000);
      } else {
        setStatus({
          loading: false,
          success: false,
          error: result.message || "Failed to send notification",
        });
      }
    } catch (error) {
      console.error("Error sending emergency notification:", error);
      const errorMessage = error.message || "An unexpected error occurred";

      setStatus({
        loading: false,
        success: false,
        error: errorMessage,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaExclamationTriangle className={styles.emergencyIcon} />
        <h2>Emergency Notification</h2>
      </div>
      <div className={styles.messageSection}>
        <label htmlFor="emergencyMessage">Message (optional)</label>
        <textarea
          id="emergencyMessage"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add details about your emergency situation..."
          rows={3}
        />
      </div>
      <div className={styles.mapSection}>
        <div className={styles.mapToggleContainer}>
          <label className={styles.mapToggleLabel}>
            <input
              type="checkbox"
              checked={includeMap}
              onChange={() => setIncludeMap(!includeMap)}
              className={styles.mapToggleInput}
            />
            <span className={styles.mapToggleText}>
              <FaMapMarkedAlt /> Include location map in email
            </span>
          </label>
        </div>

        {includeMap && currentLocation && (
          <div className={styles.mapPreviewContainer}>
            <div className={styles.mapPreviewHeader}>
              <FaMap className={styles.mapIcon} />
              <span>Map Preview</span>
            </div>
            {mapPreviewUrl ? (
              <div className={styles.mapPreview}>
                <img
                  src={mapPreviewUrl}
                  alt="Your current location"
                  className={styles.mapPreviewImage}
                />
                <div className={styles.mapCoordinates}>
                  {currentLocation.lat.toFixed(6)},{" "}
                  {currentLocation.lng.toFixed(6)}
                </div>
              </div>
            ) : (
              <div className={styles.mapPreviewLoading}>
                <FaSpinner className={styles.loadingIcon} />
                <span>Loading map...</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.notificationTypeSection}>
        <p>Send notification via:</p>
        <div className={styles.notificationOptions}>
          <label>
            <input
              type="radio"
              value="email"
              checked={notificationType === "email"}
              onChange={() => setNotificationType("email")}
            />
            <span>Email Only</span>
          </label>
          <label>
            <input
              type="radio"
              value="sms"
              checked={notificationType === "sms"}
              onChange={() => setNotificationType("sms")}
            />
            <span>SMS Only</span>
          </label>
          <label>
            <input
              type="radio"
              value="all"
              checked={notificationType === "all"}
              onChange={() => setNotificationType("all")}
            />
            <span>Both Email and SMS</span>
          </label>
        </div>
      </div>
      {contacts.length > 0 ? (
        <div className={styles.contactsSection}>
          <p>Select contacts to notify:</p>
          <div className={styles.contactsList}>
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`${styles.contactItem} ${
                  selectedContacts.includes(contact.id) ? styles.selected : ""
                }`}
                onClick={() => toggleContactSelection(contact.id)}
              >
                <div className={styles.contactInfo}>
                  <p className={styles.contactName}>{contact.name}</p>
                  <p className={styles.contactDetails}>
                    {contact.phone && `Phone: ${contact.phone}`}
                    {contact.phone && contact.email && " • "}
                    {contact.email && `Email: ${contact.email}`}
                  </p>
                </div>
                <div className={styles.checkbox}>
                  {selectedContacts.includes(contact.id) && <FaCheck />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.noContacts}>
          <p>You haven't added any emergency contacts yet.</p>
          <p>Add contacts in the Emergency Contacts section.</p>
        </div>
      )}
      {emailStatus &&
        emailStatus.emailCorrections &&
        emailStatus.emailCorrections.length > 0 && (
          <div className={`${styles.infoMessage} ${styles.emailStatus}`}>
            <FaInfoCircle className={styles.infoIcon} />
            <div>
              <p>
                <strong>Email addresses were automatically corrected:</strong>
              </p>
              <ul className={styles.emailList}>
                {emailStatus.emailCorrections.map((correction, index) => (
                  <li key={index}>
                    {correction.original} → {correction.corrected}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      {emailStatus &&
        emailStatus.emailsSent &&
        emailStatus.emailsSent.length > 0 && (
          <div className={`${styles.successMessage} ${styles.emailStatus}`}>
            <FaEnvelope className={styles.successIcon} />
            <div>
              <p>
                <strong>Emails sent successfully to:</strong>
              </p>
              <ul className={styles.emailList}>
                {emailStatus.emailsSent.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

      {emailStatus &&
        emailStatus.emailErrors &&
        emailStatus.emailErrors.length > 0 && (
          <div className={`${styles.errorMessage} ${styles.emailStatus}`}>
            <FaTimes className={styles.errorIcon} />
            <div>
              <p>
                <strong>Failed to send emails to:</strong>
              </p>
              <ul className={styles.emailList}>
                {emailStatus.emailErrors.map((item, index) => (
                  <li key={index}>
                    {item.email}
                    {item.correctedEmail && (
                      <span> (tried as {item.correctedEmail})</span>
                    )}
                    : {item.error}
                  </li>
                ))}
              </ul>
              <p className={styles.emailTroubleshooting}>
                <FaInfoCircle /> Please check that the email addresses are
                correct or try again later.
              </p>
            </div>
          </div>
        )}

      {status.error && (
        <div className={styles.errorMessage}>
          <FaTimes className={styles.errorIcon} />
          <p>{status.error}</p>
        </div>
      )}

      {status.success && (
        <div className={styles.successMessage}>
          <FaCheck className={styles.successIcon} />
          <p>Emergency notification sent successfully!</p>
        </div>
      )}

      <button
        className={styles.sendButton}
        onClick={handleSendNotification}
        disabled={status.loading || selectedContacts.length === 0}
      >
        {status.loading ? (
          <>
            <FaSpinner className={styles.spinnerIcon} />
            Sending...
          </>
        ) : (
          "Send Emergency Notification"
        )}
      </button>

      <div className={styles.disclaimer}>
        <FaInfoCircle className={styles.disclaimerIcon} />
        <p>
          This will send your current location and emergency message to your
          selected contacts.
        </p>
      </div>
    </div>
  );
};

export default EmergencyNotification;

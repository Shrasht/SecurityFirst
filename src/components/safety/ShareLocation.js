import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LocationContext } from "../../context/LocationContext";
import ShareLocationService from "../../services/ShareLocationService";
import styles from "./ShareLocation.module.css";
import {
  FaMapPin,
  FaShare,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUsers,
  FaEnvelope,
  FaClock,
  FaTimes,
  FaPlus,
  FaUser,
  FaPhone,
} from "react-icons/fa";

const ShareLocation = ({ isOpen, onClose }) => {
  const { currentUser, emergencyContacts, updateUser } =
    useContext(AuthContext);
  const { currentLocation } = useContext(LocationContext);

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [customMessage, setCustomMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [sharingResult, setSharingResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [addContactError, setAddContactError] = useState(""); // Reset state when component opens
  useEffect(() => {
    if (isOpen) {
      setSelectedContacts([]);
      setCustomMessage("This is my current location, track me");
      setSharingResult(null);
      setShowResult(false);
      setShowAddContact(false);
      setNewContact({ name: "", phone: "", email: "" });
      setAddContactError("");
    }
  }, [isOpen]);

  // Auto-select all emergency contacts by default
  useEffect(() => {
    if (isOpen && emergencyContacts && emergencyContacts.length > 0) {
      setSelectedContacts(emergencyContacts.map((contact) => contact.id));
    }
  }, [isOpen, emergencyContacts]);
  const handleContactToggle = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };
  // Handle adding a new contact
  const handleAddContact = () => {
    if (!newContact.name || (!newContact.phone && !newContact.email)) {
      setAddContactError(
        "Please provide a name and at least one contact method"
      );
      return;
    }

    // Simple validation
    if (
      newContact.phone &&
      !/^\d{10,15}$|^\d{3}[-.]?\d{3}[-.]?\d{4}$/.test(newContact.phone)
    ) {
      setAddContactError("Please enter a valid phone number");
      return;
    }

    if (
      newContact.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContact.email)
    ) {
      setAddContactError("Please enter a valid email address");
      return;
    }

    const contacts = currentUser?.emergencyContacts || [];
    const newContactId = Date.now();
    const updatedContacts = [
      ...contacts,
      {
        id: newContactId,
        ...newContact,
      },
    ];

    // Update user data using the updateUser function from context
    const updatedUser = {
      ...currentUser,
      emergencyContacts: updatedContacts,
    };

    updateUser(updatedUser);

    // Reset form and close add contact section
    setNewContact({ name: "", phone: "", email: "" });
    setAddContactError("");
    setShowAddContact(false);

    // Auto-select the new contact with the correct ID
    setSelectedContacts((prev) => [...prev, newContactId]);
  };
  const handleShareLocation = async () => {
    console.log("=== Share Location Debug ===");
    console.log("Current Location:", currentLocation);
    console.log("Selected Contacts:", selectedContacts);
    console.log("Emergency Contacts:", emergencyContacts);
    console.log("Current User:", currentUser);

    if (!currentLocation) {
      console.error("ERROR: No current location available");
      setSharingResult({
        success: false,
        message:
          "Unable to get your current location. Please enable location services and try again.",
      });
      setShowResult(true);
      return;
    }

    if (selectedContacts.length === 0) {
      console.error("ERROR: No contacts selected");
      setSharingResult({
        success: false,
        message:
          "Please select at least one contact to share your location with.",
      });
      setShowResult(true);
      return;
    } // Get selected contacts
    const contactsToShare = (emergencyContacts || []).filter((contact) =>
      selectedContacts.includes(contact.id)
    );

    console.log("Contacts to share with:", contactsToShare);

    // Check if any contacts have email addresses
    const contactsWithEmail = contactsToShare.filter(
      (contact) => contact.email
    );
    if (contactsWithEmail.length === 0) {
      console.error("ERROR: No selected contacts have email addresses");
      setSharingResult({
        success: false,
        message:
          "None of the selected contacts have email addresses. Please add email addresses to your contacts or select different contacts.",
      });
      setShowResult(true);
      return;
    }

    setIsSharing(true);
    setSharingResult(null);

    try {
      // Prepare user info
      const userInfo = {
        name: currentUser?.name || "Safety App User",
        phone: currentUser?.phone || "Not provided",
        message: customMessage,
      };

      // Prepare location data
      const locationData = {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        address:
          currentLocation.address ||
          `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(
            6
          )}`,
        timestamp: new Date().toISOString(),
        googleMapsUrl: `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`,
      };

      console.log("User Info:", userInfo);
      console.log("Location Data:", locationData);

      // Send location sharing emails
      const result = await ShareLocationService.shareLocationWithContacts(
        contactsToShare,
        userInfo,
        locationData
      );

      console.log("Share Location Result:", result);

      setSharingResult(result);
      setShowResult(true);

      // Close modal after successful sharing
      if (result.success) {
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error("Error sharing location:", error);
      setSharingResult({
        success: false,
        message: "Failed to share location. Please try again.",
      });
      setShowResult(true);
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            <FaMapPin className={styles.headerIcon} />
            Share Live Location
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {!showResult ? (
          <>
            <div className={styles.locationInfo}>
              <div className={styles.locationCard}>
                <FaMapPin className={styles.locationIcon} />
                <div className={styles.locationDetails}>
                  <h3>Your Current Location</h3>
                  {currentLocation ? (
                    <>
                      <p>{currentLocation.address || "Location detected"}</p>
                      <p className={styles.coordinates}>
                        {currentLocation.lat.toFixed(6)},{" "}
                        {currentLocation.lng.toFixed(6)}
                      </p>
                      <p className={styles.timestamp}>
                        <FaClock /> {new Date().toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className={styles.noLocation}>
                      Unable to detect location
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.messageSection}>
              <label htmlFor="customMessage">Custom Message</label>
              <textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personal message (optional)"
                rows={3}
                className={styles.messageInput}
              />
            </div>{" "}
            <div className={styles.contactsSection}>
              <div className={styles.contactsHeader}>
                <h3>
                  <FaUsers className={styles.sectionIcon} />
                  Select Contacts ({selectedContacts.length} selected)
                </h3>
                <button
                  className={styles.addContactButton}
                  onClick={() => setShowAddContact(!showAddContact)}
                  type="button"
                >
                  <FaPlus /> Add Contact
                </button>
              </div>

              {showAddContact && (
                <div className={styles.addContactForm}>
                  <h4>Add New Contact</h4>
                  {addContactError && (
                    <p className={styles.error}>{addContactError}</p>
                  )}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contactName">Name*</label>
                      <input
                        id="contactName"
                        type="text"
                        value={newContact.name}
                        onChange={(e) =>
                          setNewContact({ ...newContact, name: e.target.value })
                        }
                        placeholder="Contact name"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contactPhone">Phone</label>
                      <input
                        id="contactPhone"
                        type="tel"
                        value={newContact.phone}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="contactEmail">Email*</label>
                    <input
                      id="contactEmail"
                      type="email"
                      value={newContact.email}
                      onChange={(e) =>
                        setNewContact({ ...newContact, email: e.target.value })
                      }
                      placeholder="Email address (required for location sharing)"
                      required
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.cancelAddButton}
                      onClick={() => {
                        setShowAddContact(false);
                        setNewContact({ name: "", phone: "", email: "" });
                        setAddContactError("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.saveContactButton}
                      onClick={handleAddContact}
                    >
                      <FaPlus /> Save Contact
                    </button>
                  </div>
                </div>
              )}

              {emergencyContacts && emergencyContacts.length > 0 ? (
                <div className={styles.contactsList}>
                  {emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`${styles.contactItem} ${
                        selectedContacts.includes(contact.id)
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleContactToggle(contact.id)}
                    >
                      <div className={styles.contactInfo}>
                        <div className={styles.contactName}>
                          <FaUser className={styles.contactIcon} />
                          {contact.name}
                        </div>
                        <div className={styles.contactDetails}>
                          {contact.email && (
                            <div className={styles.contactDetail}>
                              <FaEnvelope /> {contact.email}
                            </div>
                          )}
                          {contact.phone && (
                            <div className={styles.contactDetail}>
                              <FaPhone /> {contact.phone}
                            </div>
                          )}
                          {contact.relationship && (
                            <span className={styles.relationship}>
                              ({contact.relationship})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.checkbox}>
                        {selectedContacts.includes(contact.id) && (
                          <FaCheckCircle />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noContacts}>
                  <FaExclamationTriangle />
                  <p>No emergency contacts configured.</p>
                  <p>Add a contact above to start sharing your location.</p>
                </div>
              )}
            </div>
            <div className={styles.actions}>
              <button
                className={styles.cancelButton}
                onClick={onClose}
                disabled={isSharing}
              >
                Cancel
              </button>
              <button
                className={styles.shareButton}
                onClick={handleShareLocation}
                disabled={
                  isSharing || !currentLocation || selectedContacts.length === 0
                }
              >
                {isSharing ? (
                  <>
                    <FaSpinner className={styles.spinning} />
                    Sharing Location...
                  </>
                ) : (
                  <>
                    <FaShare />
                    Share Location
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.resultSection}>
            <div
              className={`${styles.resultCard} ${
                sharingResult?.success ? styles.success : styles.error
              }`}
            >
              <div className={styles.resultIcon}>
                {sharingResult?.success ? (
                  <FaCheckCircle className={styles.successIcon} />
                ) : (
                  <FaExclamationTriangle className={styles.errorIcon} />
                )}
              </div>
              <div className={styles.resultMessage}>
                <h3>
                  {sharingResult?.success
                    ? "Location Shared Successfully!"
                    : "Sharing Failed"}
                </h3>
                <p>{sharingResult?.message}</p>

                {sharingResult?.emailsSent &&
                  sharingResult.emailsSent.length > 0 && (
                    <div className={styles.emailsList}>
                      <h4>Sent to:</h4>
                      <ul>
                        {sharingResult.emailsSent.map((email, index) => (
                          <li key={index}>{email}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {sharingResult?.emailErrors &&
                  sharingResult.emailErrors.length > 0 && (
                    <div className={styles.errorsList}>
                      <h4>Failed to send to:</h4>
                      <ul>
                        {sharingResult.emailErrors.map((error, index) => (
                          <li key={index}>
                            {error.email} - {error.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {!sharingResult?.success && (
                  <div className={styles.troubleshooting}>
                    <h4>Troubleshooting Tips:</h4>
                    <ul>
                      <li>
                        Check that your contacts have valid email addresses
                      </li>
                      <li>Ensure location services are enabled</li>
                      <li>
                        Try visiting{" "}
                        <a
                          href="/share-location-debug"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          /share-location-debug
                        </a>{" "}
                        for detailed debugging
                      </li>
                      <li>Check spam/junk folder for emails</li>
                      <li>Verify EmailJS configuration</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.resultActions}>
              <button className={styles.doneButton} onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareLocation;

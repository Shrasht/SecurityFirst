import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./EmergencyContacts.module.css";
import { FaUser, FaPhone, FaEnvelope, FaTrash, FaPlus } from "react-icons/fa";

const EmergencyContacts = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  // Load contacts from user data
  const contacts = currentUser?.emergencyContacts || [];
  // Handle adding a new contact
  const handleAddContact = () => {
    if (!newContact.name || (!newContact.phone && !newContact.email)) {
      setError("Please provide a name and at least one contact method");
      return;
    }

    // Simple validation
    if (
      newContact.phone &&
      !/^\d{10,15}$|^\d{3}[-.]?\d{3}[-.]?\d{4}$/.test(newContact.phone)
    ) {
      setError("Please enter a valid phone number");
      return;
    }

    if (
      newContact.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContact.email)
    ) {
      setError("Please enter a valid email address");
      return;
    }

    const updatedContacts = [
      ...contacts,
      {
        id: Date.now(),
        ...newContact,
      },
    ];

    // Update user data using the updateUser function from context
    const updatedUser = {
      ...currentUser,
      emergencyContacts: updatedContacts,
    };

    updateUser(updatedUser);

    // Reset form
    setNewContact({ name: "", phone: "", email: "" });
    setIsAdding(false);
    setError("");
  };
  // Handle deleting a contact
  const handleDeleteContact = (id) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);

    // Update user data using the updateUser function from context
    const updatedUser = {
      ...currentUser,
      emergencyContacts: updatedContacts,
    };

    updateUser(updatedUser);
  };

  return (
    <div className={styles.contactsContainer}>
      <h2 className={styles.title}>Emergency Contacts</h2>
      <p className={styles.subtitle}>
        Add contacts who should be notified in case of emergency
      </p>

      {contacts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't added any emergency contacts yet</p>
        </div>
      ) : (
        <div className={styles.contactsList}>
          {contacts.map((contact) => (
            <div key={contact.id} className={styles.contactCard}>
              <div className={styles.contactInfo}>
                <div className={styles.contactName}>
                  <FaUser className={styles.icon} />
                  <span>{contact.name}</span>
                </div>
                {contact.phone && (
                  <div className={styles.contactDetail}>
                    <FaPhone className={styles.icon} />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.email && (
                  <div className={styles.contactDetail}>
                    <FaEnvelope className={styles.icon} />
                    <span>{contact.email}</span>
                  </div>
                )}
              </div>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteContact(contact.id)}
                aria-label="Delete contact"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className={styles.addContactForm}>
          <h3>Add New Contact</h3>
          {error && <p className={styles.error}>{error}</p>}
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
            <label htmlFor="contactPhone">Phone Number</label>
            <input
              id="contactPhone"
              type="tel"
              value={newContact.phone}
              onChange={(e) =>
                setNewContact({ ...newContact, phone: e.target.value })
              }
              placeholder="Phone number"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contactEmail">Email Address</label>
            <input
              id="contactEmail"
              type="email"
              value={newContact.email}
              onChange={(e) =>
                setNewContact({ ...newContact, email: e.target.value })
              }
              placeholder="Email address"
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.secondaryButton}
              onClick={() => {
                setIsAdding(false);
                setNewContact({ name: "", phone: "", email: "" });
                setError("");
              }}
            >
              Cancel
            </button>
            <button className={styles.primaryButton} onClick={handleAddContact}>
              Save Contact
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.addButton} onClick={() => setIsAdding(true)}>
          <FaPlus className={styles.addIcon} />
          Add Emergency Contact
        </button>
      )}
    </div>
  );
};

export default EmergencyContacts;

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    personal: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      bloodType: "",
      medicalConditions: "",
      allergies: "",
      emergencyMedicalInfo: "",
    },
    emergencyContacts: [
      { id: 1, name: "", phone: "", relationship: "", isPrimary: true },
      { id: 2, name: "", phone: "", relationship: "", isPrimary: false },
    ],
    safetyPreferences: {
      autoShareLocation: true,
      emergencyAutoCall: false,
      safetyAlerts: true,
      routeSharing: true,
      nightModeRouting: true,
      avoidDarkAreas: true,
    },
    locationSettings: {
      updateInterval: 30,
      homeLocation: "",
      workLocation: "",
      geoFenceAlerts: false,
      locationHistory: true,
    },
    security: {
      twoFactorAuth: false,
      privacyMode: false,
      dataSharing: true,
    },
  });

  // Load saved profile data on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("safetyProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfileData((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    }
  }, []);

  // Save profile data to localStorage
  const saveProfileData = (data) => {
    try {
      localStorage.setItem("safetyProfile", JSON.stringify(data));
      setProfileData(data);
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    const updatedData = {
      ...profileData,
      personal: { ...profileData.personal, [field]: value },
    };
    setProfileData(updatedData);
  };

  const handleEmergencyContactChange = (id, field, value) => {
    const updatedContacts = profileData.emergencyContacts.map((contact) =>
      contact.id === id ? { ...contact, [field]: value } : contact
    );
    const updatedData = {
      ...profileData,
      emergencyContacts: updatedContacts,
    };
    setProfileData(updatedData);
  };

  const addEmergencyContact = () => {
    const newId =
      Math.max(...profileData.emergencyContacts.map((c) => c.id)) + 1;
    const updatedData = {
      ...profileData,
      emergencyContacts: [
        ...profileData.emergencyContacts,
        { id: newId, name: "", phone: "", relationship: "", isPrimary: false },
      ],
    };
    setProfileData(updatedData);
  };

  const removeEmergencyContact = (id) => {
    const updatedData = {
      ...profileData,
      emergencyContacts: profileData.emergencyContacts.filter(
        (contact) => contact.id !== id
      ),
    };
    setProfileData(updatedData);
  };

  const handlePreferenceChange = (category, field, value) => {
    const updatedData = {
      ...profileData,
      [category]: { ...profileData[category], [field]: value },
    };
    setProfileData(updatedData);
  };

  const handleSaveProfile = () => {
    saveProfileData(profileData);
    setIsEditing(false);

    // Update user context if name or email changed
    if (updateUser) {
      updateUser({
        name: profileData.personal.name,
        email: profileData.personal.email,
      });
    }

    alert("Profile saved successfully!");
  };

  const renderPersonalInfo = () => (
    <div className={styles.tabContent}>
      <h3>Personal Information</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            value={profileData.personal.name}
            onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
            disabled={!isEditing}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={profileData.personal.email}
            onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
            disabled={!isEditing}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="tel"
            value={profileData.personal.phone}
            onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
            disabled={!isEditing}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Blood Type</label>
          <select
            value={profileData.personal.bloodType}
            onChange={(e) =>
              handlePersonalInfoChange("bloodType", e.target.value)
            }
            disabled={!isEditing}
            className={styles.formSelect}
          >
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Medical Conditions</label>
        <textarea
          value={profileData.personal.medicalConditions}
          onChange={(e) =>
            handlePersonalInfoChange("medicalConditions", e.target.value)
          }
          disabled={!isEditing}
          className={styles.formTextarea}
          placeholder="List any medical conditions emergency responders should know about"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Allergies</label>
        <textarea
          value={profileData.personal.allergies}
          onChange={(e) =>
            handlePersonalInfoChange("allergies", e.target.value)
          }
          disabled={!isEditing}
          className={styles.formTextarea}
          placeholder="List any allergies (medications, foods, etc.)"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Emergency Medical Information</label>
        <textarea
          value={profileData.personal.emergencyMedicalInfo}
          onChange={(e) =>
            handlePersonalInfoChange("emergencyMedicalInfo", e.target.value)
          }
          disabled={!isEditing}
          className={styles.formTextarea}
          placeholder="Any additional medical information for emergencies"
        />
      </div>
    </div>
  );

  const renderEmergencyContacts = () => (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <h3>Emergency Contacts</h3>
        {isEditing && (
          <button onClick={addEmergencyContact} className={styles.addButton}>
            + Add Contact
          </button>
        )}
      </div>

      {profileData.emergencyContacts.map((contact) => (
        <div key={contact.id} className={styles.contactCard}>
          <div className={styles.contactHeader}>
            <span
              className={
                contact.isPrimary ? styles.primaryBadge : styles.secondaryBadge
              }
            >
              {contact.isPrimary ? "Primary Contact" : "Emergency Contact"}
            </span>
            {isEditing && profileData.emergencyContacts.length > 1 && (
              <button
                onClick={() => removeEmergencyContact(contact.id)}
                className={styles.removeButton}
              >
                ×
              </button>
            )}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) =>
                  handleEmergencyContactChange(
                    contact.id,
                    "name",
                    e.target.value
                  )
                }
                disabled={!isEditing}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) =>
                  handleEmergencyContactChange(
                    contact.id,
                    "phone",
                    e.target.value
                  )
                }
                disabled={!isEditing}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Relationship</label>
              <input
                type="text"
                value={contact.relationship}
                onChange={(e) =>
                  handleEmergencyContactChange(
                    contact.id,
                    "relationship",
                    e.target.value
                  )
                }
                disabled={!isEditing}
                className={styles.formInput}
                placeholder="e.g., Spouse, Parent, Friend"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSafetyPreferences = () => (
    <div className={styles.tabContent}>
      <h3>Safety Preferences</h3>

      <div className={styles.preferencesGrid}>
        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Auto-Share Location in Emergency</label>
            <span>
              Automatically share your location when emergency is detected
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.safetyPreferences.autoShareLocation}
              onChange={(e) =>
                handlePreferenceChange(
                  "safetyPreferences",
                  "autoShareLocation",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Emergency Auto-Call</label>
            <span>
              Automatically call emergency services when danger is detected
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.safetyPreferences.emergencyAutoCall}
              onChange={(e) =>
                handlePreferenceChange(
                  "safetyPreferences",
                  "emergencyAutoCall",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Safety Alerts</label>
            <span>Receive notifications about safety risks in your area</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.safetyPreferences.safetyAlerts}
              onChange={(e) =>
                handlePreferenceChange(
                  "safetyPreferences",
                  "safetyAlerts",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Route Sharing</label>
            <span>
              Allow sharing your planned routes with emergency contacts
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.safetyPreferences.routeSharing}
              onChange={(e) =>
                handlePreferenceChange(
                  "safetyPreferences",
                  "routeSharing",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Night Mode Routing</label>
            <span>Prioritize well-lit routes during nighttime</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.safetyPreferences.nightModeRouting}
              onChange={(e) =>
                handlePreferenceChange(
                  "safetyPreferences",
                  "nightModeRouting",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Avoid Dark Areas</label>
            <span>Avoid poorly lit or isolated areas when possible</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.safetyPreferences.avoidDarkAreas}
              onChange={(e) =>
                handlePreferenceChange(
                  "safetyPreferences",
                  "avoidDarkAreas",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderLocationSettings = () => (
    <div className={styles.tabContent}>
      <h3>Location Settings</h3>

      <div className={styles.formGroup}>
        <label>Location Update Interval</label>
        <select
          value={profileData.locationSettings.updateInterval}
          onChange={(e) =>
            handlePreferenceChange(
              "locationSettings",
              "updateInterval",
              parseInt(e.target.value)
            )
          }
          disabled={!isEditing}
          className={styles.formSelect}
        >
          <option value={10}>Every 10 seconds</option>
          <option value={30}>Every 30 seconds</option>
          <option value={60}>Every minute</option>
          <option value={300}>Every 5 minutes</option>
        </select>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Home Location</label>
          <input
            type="text"
            value={profileData.locationSettings.homeLocation}
            onChange={(e) =>
              handlePreferenceChange(
                "locationSettings",
                "homeLocation",
                e.target.value
              )
            }
            disabled={!isEditing}
            className={styles.formInput}
            placeholder="Enter your home address"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Work Location</label>
          <input
            type="text"
            value={profileData.locationSettings.workLocation}
            onChange={(e) =>
              handlePreferenceChange(
                "locationSettings",
                "workLocation",
                e.target.value
              )
            }
            disabled={!isEditing}
            className={styles.formInput}
            placeholder="Enter your work address"
          />
        </div>
      </div>

      <div className={styles.preferencesGrid}>
        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Geo-fence Alerts</label>
            <span>Get notified when entering/leaving safe zones</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.locationSettings.geoFenceAlerts}
              onChange={(e) =>
                handlePreferenceChange(
                  "locationSettings",
                  "geoFenceAlerts",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Location History</label>
            <span>Save location history for safety analysis</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.locationSettings.locationHistory}
              onChange={(e) =>
                handlePreferenceChange(
                  "locationSettings",
                  "locationHistory",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className={styles.tabContent}>
      <h3>Security Settings</h3>

      <div className={styles.preferencesGrid}>
        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Two-Factor Authentication</label>
            <span>Add an extra layer of security to your account</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.security.twoFactorAuth}
              onChange={(e) =>
                handlePreferenceChange(
                  "security",
                  "twoFactorAuth",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Privacy Mode</label>
            <span>Hide your location from non-emergency contacts</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.security.privacyMode}
              onChange={(e) =>
                handlePreferenceChange(
                  "security",
                  "privacyMode",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.preferenceItem}>
          <div className={styles.preferenceInfo}>
            <label>Data Sharing</label>
            <span>Share anonymized data to improve safety features</span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={profileData.security.dataSharing}
              onChange={(e) =>
                handlePreferenceChange(
                  "security",
                  "dataSharing",
                  e.target.checked
                )
              }
              disabled={!isEditing}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.securityActions}>
        <button className={styles.securityButton} disabled={!isEditing}>
          Change Password
        </button>
        <button className={styles.securityButton} disabled={!isEditing}>
          Download My Data
        </button>
        <button
          className={`${styles.securityButton} ${styles.dangerButton}`}
          disabled={!isEditing}
        >
          Delete Account
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Safety Profile</h1>
        <p>Manage your safety settings and emergency information</p>
        <div className={styles.headerActions}>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Edit Profile
            </button>
          ) : (
            <div className={styles.editActions}>
              <button onClick={handleSaveProfile} className={styles.saveButton}>
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "personal" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Info
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "contacts" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("contacts")}
          >
            Emergency Contacts
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "safety" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("safety")}
          >
            Safety Preferences
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "location" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("location")}
          >
            Location Settings
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "security" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "personal" && renderPersonalInfo()}
          {activeTab === "contacts" && renderEmergencyContacts()}
          {activeTab === "safety" && renderSafetyPreferences()}
          {activeTab === "location" && renderLocationSettings()}
          {activeTab === "security" && renderSecurity()}
        </div>
      </div>
    </div>
  );
};

export default Profile;

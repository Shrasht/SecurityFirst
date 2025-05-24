import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LocationContext } from "../../context/LocationContext";
import ShareLocationService from "../../services/ShareLocationService";
import emailjs from "@emailjs/browser";

const ShareLocationDebug = () => {
  const { currentUser, emergencyContacts } = useContext(AuthContext);
  const { currentLocation } = useContext(LocationContext);
  const [debugOutput, setDebugOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const log = (message) => {
    setDebugOutput(
      (prev) => prev + "\n" + new Date().toLocaleTimeString() + ": " + message
    );
  };

  const runDebugTest = async () => {
    setIsRunning(true);
    setDebugOutput("=== Share Location Debug Test ===\n");

    try {
      // Check EmailJS configuration
      log("1. Checking EmailJS Configuration...");
      log(
        `Service ID: ${
          process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_1l9sc5j"
        }`
      );
      log(
        `Template ID: ${
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_k0oohzo"
        }`
      );
      log(
        `Public Key: ${
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "Sztbu2xNTjpP_dAyq"
        }`
      );

      // Check current user
      log("\n2. Checking Current User...");
      if (currentUser) {
        log(`User Name: ${currentUser.name || "Not set"}`);
        log(`User Phone: ${currentUser.phone || "Not set"}`);
        log(`Emergency Contacts: ${emergencyContacts?.length || 0}`);
      } else {
        log("ERROR: No current user found!");
        return;
      }

      // Check emergency contacts
      log("\n3. Checking Emergency Contacts...");
      if (!emergencyContacts || emergencyContacts.length === 0) {
        log("ERROR: No emergency contacts configured!");
        return;
      }

      emergencyContacts.forEach((contact, index) => {
        log(
          `Contact ${index + 1}: ${contact.name} - ${
            contact.email || "No email"
          }`
        );
      });

      // Check location
      log("\n4. Checking Current Location...");
      if (currentLocation) {
        log(`Latitude: ${currentLocation.lat}`);
        log(`Longitude: ${currentLocation.lng}`);
        log(`Address: ${currentLocation.address || "Not available"}`);
      } else {
        log("ERROR: No current location available!");
        return;
      }

      // Test EmailJS initialization
      log("\n5. Testing EmailJS Initialization...");
      try {
        ShareLocationService.initEmailJS();
        log("EmailJS initialized successfully");
      } catch (error) {
        log(`ERROR initializing EmailJS: ${error.message}`);
        return;
      }

      // Prepare test data
      log("\n6. Preparing Test Data...");
      const testContact = emergencyContacts.find((contact) => contact.email);
      if (!testContact) {
        log("ERROR: No contacts with email addresses found!");
        return;
      }

      const userInfo = {
        name: currentUser.name || "Test User",
        phone: currentUser.phone || "Not provided",
        message: "DEBUG TEST - Sharing location for testing purposes",
      };

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

      log(`Test Contact: ${testContact.name} (${testContact.email})`);
      log(`User Info: ${JSON.stringify(userInfo, null, 2)}`);
      log(`Location Data: ${JSON.stringify(locationData, null, 2)}`);

      // Test template parameters
      log("\n7. Testing Template Parameters...");
      const templateParams = {
        to_name: testContact.name || "Safety Contact",
        from_name: "Safety App",
        user_name: userInfo.name || "Safety App User",
        message: userInfo.message,
        user_location: locationData.address,
        timestamp: new Date().toLocaleString(),
        google_maps_url: locationData.googleMapsUrl,
        reply_to: "noreply@safetyapp.com",
      };

      log("Template Parameters:");
      log(JSON.stringify(templateParams, null, 2));

      // Test email sending
      log("\n8. Testing Email Send...");
      try {
        const result = await emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_1l9sc5j",
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_k0oohzo",
          templateParams,
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "Sztbu2xNTjpP_dAyq"
        );

        log(
          `SUCCESS: Email sent! Status: ${result.status}, Text: ${result.text}`
        );
      } catch (error) {
        log(`ERROR sending email: ${error.message || error.text || error}`);
        log(`Error details: ${JSON.stringify(error, null, 2)}`);
      }

      // Test ShareLocationService
      log("\n9. Testing ShareLocationService...");
      try {
        const result = await ShareLocationService.shareLocationWithContacts(
          [testContact],
          userInfo,
          locationData
        );

        log(`ShareLocationService result: ${JSON.stringify(result, null, 2)}`);
      } catch (error) {
        log(`ERROR in ShareLocationService: ${error.message}`);
      }
    } catch (error) {
      log(`FATAL ERROR: ${error.message}`);
    } finally {
      setIsRunning(false);
      log("\n=== Debug Test Complete ===");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Share Location Debug</h2>
      <button
        onClick={runDebugTest}
        disabled={isRunning}
        style={{
          background: isRunning ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: isRunning ? "not-allowed" : "pointer",
        }}
      >
        {isRunning ? "Running Debug..." : "Run Debug Test"}
      </button>

      <pre
        style={{
          background: "#f8f9fa",
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "15px",
          marginTop: "20px",
          whiteSpace: "pre-wrap",
          maxHeight: "500px",
          overflow: "auto",
        }}
      >
        {debugOutput || 'Click "Run Debug Test" to start debugging...'}
      </pre>
    </div>
  );
};

export default ShareLocationDebug;

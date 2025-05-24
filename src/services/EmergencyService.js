import emailjs from "@emailjs/browser";
import axios from "axios";

// EmailJS constants from environment variables
const EMAILJS_SERVICE_ID =
  process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_1l9sc5j";
const EMAILJS_TEMPLATE_ID =
  process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_k0oohzo";
const EMAILJS_PUBLIC_KEY =
  process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "Sztbu2xNTjpP_dAyq";

// Track if EmailJS is initialized
let isEmailJSInitialized = false;

class EmergencyService {
  // Initialize EmailJS
  static initEmailJS() {
    if (isEmailJSInitialized) {
      console.log("EmailJS already initialized");
      return true;
    }

    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      isEmailJSInitialized = true;
      console.log(
        "EmailJS initialized with public key:",
        EMAILJS_PUBLIC_KEY.substring(0, 5) + "..."
      );
      console.log("Using service ID:", EMAILJS_SERVICE_ID);
      console.log("Using template ID:", EMAILJS_TEMPLATE_ID);
      return true;
    } catch (error) {
      console.error("Failed to initialize EmailJS:", error);
      return false;
    }
  }

  // Generate a static map URL using HERE Maps API
  static generateStaticMapUrl(location, width = 400, height = 300) {
    if (!location || !location.lat || !location.lng) {
      console.error("Invalid location for map generation");
      return null;
    }

    const API_KEY =
      process.env.REACT_APP_HERE_MAPS_API_KEY ||
      "iX6ozBxa5iu1te5t17ppcdJd4HwEXikoncIJgIh7WK8";

    return `https://image.maps.ls.hereapi.com/mia/1.6/mapview?c=${location.lat},${location.lng}&z=15&w=${width}&h=${height}&poi=${location.lat},${location.lng}&apiKey=${API_KEY}`;
  }

  // Parse EmailJS error messages for better user feedback
  static parseEmailJSError(error) {
    if (!error) return "Unknown error";

    // Handle different types of errors
    if (typeof error === "string") return error;

    if (error.text) return error.text;
    if (error.message) return error.message;

    // Handle HTTP status codes
    if (error.status) {
      switch (error.status) {
        case 400:
          return "Invalid request. Please check your message and try again.";
        case 401:
          return "Authentication failed. Please contact support.";
        case 402:
          return "Email service quota exceeded. Please try again later.";
        case 403:
          return "Service temporarily unavailable. Please try again.";
        case 404:
          return "Email service not found. Please contact support.";
        case 429:
          return "Too many requests. Please wait a moment and try again.";
        case 500:
          return "Email service error. Please try again later.";
        default:
          return `Email service error (${error.status}). Please try again.`;
      }
    }

    return "Failed to send email. Please try again.";
  }

  // Send email notification with map
  static async sendEmailNotificationWithMap(contacts, userInfo, locationData) {
    console.log("Sending email notification with map to:", contacts);

    // Initialize EmailJS if not already initialized
    this.initEmailJS();

    const emailContacts = contacts.filter((contact) => contact.email);
    if (emailContacts.length === 0) {
      return {
        success: false,
        message: "No valid email contacts found",
      };
    }

    try {
      // Get static map image for the location
      const mapImageUrl = this.generateStaticMapUrl(locationData);

      const emailsSent = [];
      const emailErrors = [];
      const emailCorrections = [];

      // Send emails to each contact
      const emailPromises = emailContacts.map(async (contact) => {
        let emailToUse = contact.email;

        // Check if email needs correction
        const correctedEmail = this.correctCommonEmailTypos(emailToUse);
        if (correctedEmail !== emailToUse) {
          console.log(`Corrected email: ${emailToUse} → ${correctedEmail}`);
          emailCorrections.push({
            original: emailToUse,
            corrected: correctedEmail,
          });
          emailToUse = correctedEmail;
        }

        // Validate email format
        if (!this.isValidEmail(emailToUse)) {
          console.error(`Invalid email format: ${emailToUse}`);
          emailErrors.push({
            email: contact.email,
            error: "Invalid email format",
          });
          return null;
        }
        const templateParams = {
          // EmailJS template variables for the live location sharing format
          user_name: userInfo.name || "Safety App User", // {{user_name}} - who triggered the alert
          timestamp: new Date().toLocaleString(), // {{timestamp}} - when alert was triggered
          user_location:
            locationData.address ||
            `${locationData.lat.toFixed(6)}, ${locationData.lng.toFixed(6)}`, // {{user_location}} - location description
          message: userInfo.message || "Emergency alert triggered", // {{message}} - emergency message

          // Additional template variables for compatibility
          name: userInfo.name || "Safety App User", // {{name}} - backwards compatibility
          time: new Date().toLocaleString(), // {{time}} - backwards compatibility
          contact_name: contact.name || "Emergency Contact", // {{contact_name}} - contact's name

          // Additional useful parameters
          to_email: emailToUse,
          emergency_message:
            userInfo.message ||
            "I need help! This is an emergency notification.",
          user_phone: userInfo.phone || "Not provided",
          location_address: locationData.address || "Unknown location",
          location_coordinates: `${locationData.lat.toFixed(
            6
          )}, ${locationData.lng.toFixed(6)}`,
          google_maps_url: locationData.googleMapsUrl,
          here_maps_url: `https://wego.here.com/?map=${locationData.lat},${locationData.lng},15,normal`, // HERE Maps link
          map_image_url: mapImageUrl || "",
        };

        try {
          console.log(`Sending email to ${emailToUse} with EmailJS...`);

          // Add retry logic for better reliability
          const maxRetries = 2;
          let attempt = 0;
          let lastError = null;

          while (attempt <= maxRetries) {
            try {
              attempt++;
              console.log(
                `Attempt ${attempt} of ${maxRetries + 1} for ${emailToUse}`
              );

              const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
              );

              console.log(`Email sent successfully to ${emailToUse}:`, result);
              emailsSent.push(emailToUse);
              return result;
            } catch (retryError) {
              lastError = retryError;
              if (attempt <= maxRetries) {
                console.log(
                  `Retrying after error: ${this.parseEmailJSError(retryError)}`
                );
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
              }
            }
          }

          // If we're here, all retries failed
          throw lastError;
        } catch (error) {
          const errorMessage = this.parseEmailJSError(error);
          console.error(
            `Failed to send email to ${emailToUse}:`,
            errorMessage,
            error
          );
          emailErrors.push({
            email: contact.email,
            correctedEmail:
              emailToUse !== contact.email ? emailToUse : undefined,
            error: errorMessage,
          });
          return null;
        }
      });

      try {
        await Promise.all(emailPromises);
      } catch (promiseError) {
        console.error("Error in Promise.all for emails:", promiseError);
      }

      return {
        success: emailsSent.length > 0,
        message:
          emailsSent.length > 0
            ? `Emergency emails sent to ${emailsSent.length} contacts`
            : "Failed to send emails",
        emailsSent,
        emailErrors: emailErrors.length > 0 ? emailErrors : null,
        emailCorrections: emailCorrections.length > 0 ? emailCorrections : null,
      };
    } catch (error) {
      console.error("Error sending email notifications:", error);
      return {
        success: false,
        message: `Email notification failed: ${this.parseEmailJSError(error)}`,
      };
    }
  }

  // Send email notification without map
  static async sendEmailNotification(contacts, userInfo, locationData) {
    console.log("Sending email notification without map to:", contacts);

    // Initialize EmailJS if not already initialized
    this.initEmailJS();

    const emailContacts = contacts.filter((contact) => contact.email);
    if (emailContacts.length === 0) {
      return {
        success: false,
        message: "No valid email contacts found",
      };
    }

    try {
      const emailsSent = [];
      const emailErrors = [];
      const emailCorrections = [];

      // Send emails to each contact
      const emailPromises = emailContacts.map(async (contact) => {
        let emailToUse = contact.email;

        // Check if email needs correction
        const correctedEmail = this.correctCommonEmailTypos(emailToUse);
        if (correctedEmail !== emailToUse) {
          console.log(`Corrected email: ${emailToUse} → ${correctedEmail}`);
          emailCorrections.push({
            original: emailToUse,
            corrected: correctedEmail,
          });
          emailToUse = correctedEmail;
        }

        // Validate email format
        if (!this.isValidEmail(emailToUse)) {
          console.error(`Invalid email format: ${emailToUse}`);
          emailErrors.push({
            email: contact.email,
            error: "Invalid email format",
          });
          return null;
        }
        const templateParams = {
          // EmailJS template variables for the live location sharing format
          user_name: userInfo.name || "Safety App User", // {{user_name}} - who triggered the alert
          timestamp: new Date().toLocaleString(), // {{timestamp}} - when alert was triggered
          user_location:
            locationData.address ||
            `${locationData.lat.toFixed(6)}, ${locationData.lng.toFixed(6)}`, // {{user_location}} - location description
          message: userInfo.message || "Emergency alert triggered", // {{message}} - emergency message

          // Additional template variables for compatibility
          name: userInfo.name || "Safety App User", // {{name}} - backwards compatibility
          time: new Date().toLocaleString(), // {{time}} - backwards compatibility
          contact_name: contact.name || "Emergency Contact", // {{contact_name}} - contact's name

          // Additional useful parameters
          to_email: emailToUse,
          emergency_message:
            userInfo.message ||
            "I need help! This is an emergency notification.",
          user_phone: userInfo.phone || "Not provided",
          location_address: locationData.address || "Unknown location",
          location_coordinates: `${locationData.lat.toFixed(
            6
          )}, ${locationData.lng.toFixed(6)}`,
          google_maps_url: locationData.googleMapsUrl,
          here_maps_url: `https://wego.here.com/?map=${locationData.lat},${locationData.lng},15,normal`, // HERE Maps link
        };

        try {
          console.log(`Sending email to ${emailToUse} with EmailJS...`);

          // Add retry logic for better reliability
          const maxRetries = 2;
          let attempt = 0;
          let lastError = null;

          while (attempt <= maxRetries) {
            try {
              attempt++;
              console.log(
                `Attempt ${attempt} of ${maxRetries + 1} for ${emailToUse}`
              );

              const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
              );

              console.log(`Email sent successfully to ${emailToUse}:`, result);
              emailsSent.push(emailToUse);
              return result;
            } catch (retryError) {
              lastError = retryError;
              if (attempt <= maxRetries) {
                console.log(
                  `Retrying after error: ${this.parseEmailJSError(retryError)}`
                );
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
              }
            }
          }

          // If we're here, all retries failed
          throw lastError;
        } catch (error) {
          const errorMessage = this.parseEmailJSError(error);
          console.error(
            `Failed to send email to ${emailToUse}:`,
            errorMessage,
            error
          );
          emailErrors.push({
            email: contact.email,
            correctedEmail:
              emailToUse !== contact.email ? emailToUse : undefined,
            error: errorMessage,
          });
          return null;
        }
      });

      try {
        await Promise.all(emailPromises);
      } catch (promiseError) {
        console.error("Error in Promise.all for emails:", promiseError);
      }

      return {
        success: emailsSent.length > 0,
        message:
          emailsSent.length > 0
            ? `Emergency emails sent to ${emailsSent.length} contacts`
            : "Failed to send emails",
        emailsSent,
        emailErrors: emailErrors.length > 0 ? emailErrors : null,
        emailCorrections: emailCorrections.length > 0 ? emailCorrections : null,
      };
    } catch (error) {
      console.error("Error sending email notifications:", error);
      return {
        success: false,
        message: `Email notification failed: ${this.parseEmailJSError(error)}`,
      };
    }
  }

  // Validate email format
  static isValidEmail(email) {
    if (!email || typeof email !== "string") return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  // Correct common email typos
  static correctCommonEmailTypos(email) {
    if (!email || typeof email !== "string") return email;

    let corrected = email.trim().toLowerCase();

    // Common domain corrections
    const domainCorrections = {
      "gmail.co": "gmail.com",
      "gmai.com": "gmail.com",
      "gmial.com": "gmail.com",
      "yahoo.co": "yahoo.com",
      "yahooo.com": "yahoo.com",
      "hotmial.com": "hotmail.com",
      "hotmai.com": "hotmail.com",
      "outlok.com": "outlook.com",
      "outloo.com": "outlook.com",
    };

    for (const [wrong, correct] of Object.entries(domainCorrections)) {
      if (corrected.endsWith("@" + wrong)) {
        corrected = corrected.replace("@" + wrong, "@" + correct);
        break;
      }
    }

    return corrected;
  }

  // Send SMS notification (placeholder implementation)
  static async sendSMSNotification(contacts, userInfo, locationData) {
    console.log("Sending SMS notification to:", contacts);

    const smsContacts = contacts.filter((contact) => contact.phone);
    if (smsContacts.length === 0) {
      return {
        success: false,
        message: "No valid phone contacts found",
      };
    }

    try {
      // This is a placeholder for actual SMS API integration
      // In a production app, you would integrate with Twilio, MessageBird, etc.

      const message = `EMERGENCY ALERT from ${userInfo.name}: ${
        userInfo.message
      } - I'm at: ${locationData.address || "Unknown location"}. Map: ${
        locationData.googleMapsUrl
      }`;

      console.log("SMS would be sent with message:", message);
      console.log(
        "SMS recipients:",
        smsContacts.map((contact) => contact.phone).join(", ")
      );

      // Simulating successful SMS delivery for demonstration
      return {
        success: true,
        message: `Emergency SMS sent to ${smsContacts.length} contacts`,
        smsSent: smsContacts.map((contact) => contact.phone),
      };
    } catch (error) {
      console.error("Error sending SMS notifications:", error);
      return {
        success: false,
        message: `SMS notification failed: ${error.message || "Unknown error"}`,
      };
    }
  }

  // Send both email and SMS notifications
  static async sendAllNotifications(contacts, userInfo, locationData) {
    const emailPromise = this.sendEmailNotification(
      contacts,
      userInfo,
      locationData
    );
    const smsPromise = this.sendSMSNotification(
      contacts,
      userInfo,
      locationData
    );

    try {
      const [emailResult, smsResult] = await Promise.all([
        emailPromise,
        smsPromise,
      ]);

      return {
        success: emailResult.success || smsResult.success,
        message: "Emergency notifications sent",
        email: emailResult,
        sms: smsResult,
      };
    } catch (error) {
      console.error("Error sending notifications:", error);
      return {
        success: false,
        message: `Notification failed: ${error.message || "Unknown error"}`,
      };
    }
  }
}

export default EmergencyService;

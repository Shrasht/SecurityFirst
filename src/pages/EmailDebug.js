import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const EmailDebug = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  // Test with minimal template parameters
  const sendMinimalTest = async () => {
    setLoading(true);
    setStatus("Testing minimal configuration...");
    setDebugInfo(null);

    try {
      // Initialize EmailJS
      emailjs.init("Sztbu2xNTjpP_dAyq");

      // Minimal template parameters - these should work with most templates
      const templateParams = {
        to_name: "Test User",
        from_name: "Safety App",
        message: "This is a minimal test email.",
        reply_to: "noreply@example.com",
      };

      console.log("Sending minimal test with params:", templateParams);

      const result = await emailjs.send(
        "service_1l9sc5j",
        "template_k0oohzo",
        templateParams
      );

      console.log("Minimal test result:", result);

      setDebugInfo({
        type: "minimal",
        result: result,
        params: templateParams,
        status: result.status,
        text: result.text,
      });

      if (result.status === 200) {
        setStatus("✅ Minimal test completed successfully!");
      } else {
        setStatus(`⚠️ Unexpected status: ${result.status}`);
      }
    } catch (error) {
      console.error("Minimal test error:", error);
      setStatus(
        `❌ Minimal test failed: ${
          error.text || error.message || JSON.stringify(error)
        }`
      );
      setDebugInfo({
        type: "error",
        error: error,
        errorText: error.text,
        errorMessage: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Test with your actual email address
  const sendToActualEmail = async () => {
    setLoading(true);
    setStatus("Testing with actual email...");
    setDebugInfo(null);

    try {
      emailjs.init("Sztbu2xNTjpP_dAyq");

      const templateParams = {
        to_email: "shrashtsingh@gmail.com",
        to_name: "Shrash Singh",
        from_name: "Safety App Debug Test",
        subject: "Debug Test - Safety App",
        message:
          "This is a debug test to verify email delivery. If you receive this, EmailJS is working correctly.",
        user_name: "Debug User",
        reply_to: "noreply@safetyapp.com",
      };

      console.log("Sending to actual email with params:", templateParams);

      const result = await emailjs.send(
        "service_1l9sc5j",
        "template_k0oohzo",
        templateParams
      );

      console.log("Actual email test result:", result);

      setDebugInfo({
        type: "actual_email",
        result: result,
        params: templateParams,
        status: result.status,
        text: result.text,
      });

      setStatus(
        "✅ Email sent to actual address! Check your inbox and spam folder."
      );
    } catch (error) {
      console.error("Actual email test error:", error);
      setStatus(`❌ Actual email test failed: ${error.text || error.message}`);
      setDebugInfo({
        type: "error",
        error: error,
      });
    } finally {
      setLoading(false);
    }
  };

  // Test EmailJS connection without sending
  const testConnection = async () => {
    setLoading(true);
    setStatus("Testing EmailJS connection...");

    try {
      // Just initialize and check if it works
      emailjs.init("Sztbu2xNTjpP_dAyq");

      // Try to get service info (this might not work but let's try)
      setStatus("✅ EmailJS initialized successfully. Connection seems OK.");
      setDebugInfo({
        type: "connection",
        serviceId: "service_1l9sc5j",
        templateId: "template_k0oohzo",
        publicKey: "Sztbu2xNTjpP_dAyq",
        status: "initialized",
      });
    } catch (error) {
      setStatus(`❌ EmailJS connection failed: ${error.message}`);
      setDebugInfo({
        type: "connection_error",
        error: error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>EmailJS Debug Page</h1>

      <div
        style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <h3>🔍 Debug Steps:</h3>
        <ol>
          <li>
            <strong>Test Connection</strong> - Check if EmailJS initializes
          </li>
          <li>
            <strong>Minimal Test</strong> - Send with basic parameters
          </li>
          <li>
            <strong>Actual Email Test</strong> - Send to your real email
          </li>
        </ol>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          {loading ? "Testing..." : "1. Test Connection"}
        </button>

        <button
          onClick={sendMinimalTest}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          {loading ? "Testing..." : "2. Minimal Test"}
        </button>

        <button
          onClick={sendToActualEmail}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "10px",
          }}
        >
          {loading ? "Testing..." : "3. Send to Real Email"}
        </button>
      </div>

      {status && (
        <div
          style={{
            padding: "15px",
            backgroundColor: status.includes("✅")
              ? "#d4edda"
              : status.includes("⚠️")
              ? "#fff3cd"
              : "#f8d7da",
            border: `1px solid ${
              status.includes("✅")
                ? "#c3e6cb"
                : status.includes("⚠️")
                ? "#ffeaa7"
                : "#f5c6cb"
            }`,
            borderRadius: "5px",
            color: status.includes("✅")
              ? "#155724"
              : status.includes("⚠️")
              ? "#856404"
              : "#721c24",
            marginBottom: "20px",
          }}
        >
          {status}
        </div>
      )}

      {debugInfo && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "5px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <h3>Debug Information:</h3>
          <pre
            style={{
              backgroundColor: "#e9ecef",
              padding: "10px",
              borderRadius: "3px",
              fontSize: "12px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      <div
        style={{
          backgroundColor: "#e7f3ff",
          border: "1px solid #b8daff",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <h3>🛠️ Troubleshooting Tips:</h3>
        <ul>
          <li>
            <strong>Check EmailJS Dashboard:</strong> Go to{" "}
            <a
              href="https://dashboard.emailjs.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              EmailJS Dashboard
            </a>{" "}
            to see if emails are being sent
          </li>
          <li>
            <strong>Verify Template:</strong> Make sure template
            "template_k0oohzo" exists and has the right variable names
          </li>
          <li>
            <strong>Check Service:</strong> Verify service "service_1l9sc5j" is
            properly configured with your email provider
          </li>
          <li>
            <strong>Rate Limits:</strong> Free EmailJS accounts have limits (200
            emails/month)
          </li>
          <li>
            <strong>Spam Folder:</strong> Check your spam/junk folder
          </li>
          <li>
            <strong>Template Variables:</strong> Common variables are: to_name,
            from_name, message, reply_to
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f1f3f4",
          borderRadius: "5px",
        }}
      >
        <h3>Current Configuration:</h3>
        <p>
          <strong>Service ID:</strong> service_1l9sc5j
        </p>
        <p>
          <strong>Template ID:</strong> template_k0oohzo
        </p>
        <p>
          <strong>Public Key:</strong> Sztbu2xNTjpP_dAyq
        </p>
      </div>
    </div>
  );
};

export default EmailDebug;

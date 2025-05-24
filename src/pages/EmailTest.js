import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const EmailTest = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    to_email: "",
    to_name: "",
    from_name: "Safety App Test",
    message: "This is a test email from the Safety App",
  });

  const EMAILJS_SERVICE_ID =
    process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_1l9sc5j";
  const EMAILJS_TEMPLATE_ID =
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_k0oohzo";
  const EMAILJS_PUBLIC_KEY =
    process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "Sztbu2xNTjpP_dAyq";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      // Initialize EmailJS
      emailjs.init(EMAILJS_PUBLIC_KEY);

      console.log("Sending email with:", {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        public_key: EMAILJS_PUBLIC_KEY,
        template_params: formData,
      });

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formData,
        EMAILJS_PUBLIC_KEY
      );

      console.log("Email sent successfully:", result);
      setStatus("✅ Email sent successfully! Check your inbox.");
    } catch (error) {
      console.error("Email sending failed:", error);
      setStatus(`❌ Failed to send email: ${error.text || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Email Test Page</h2>
      <p>Test if EmailJS is working correctly</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Recipient Email:
            <input
              type="email"
              name="to_email"
              value={formData.to_email}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              placeholder="Enter your email to test"
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            Recipient Name:
            <input
              type="text"
              name="to_name"
              value={formData.to_name}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              placeholder="Enter recipient name"
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            Test Message:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              placeholder="Enter test message"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send Test Email"}
        </button>
      </form>

      {status && (
        <div
          style={{
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: status.includes("✅") ? "#d4edda" : "#f8d7da",
            color: status.includes("✅") ? "#155724" : "#721c24",
            border: status.includes("✅")
              ? "1px solid #c3e6cb"
              : "1px solid #f5c6cb",
          }}
        >
          {status}
        </div>
      )}

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h3>Current Configuration:</h3>
        <p>
          <strong>Service ID:</strong> {EMAILJS_SERVICE_ID}
        </p>
        <p>
          <strong>Template ID:</strong> {EMAILJS_TEMPLATE_ID}
        </p>
        <p>
          <strong>Public Key:</strong> {EMAILJS_PUBLIC_KEY.substring(0, 8)}...
        </p>
      </div>
    </div>
  );
};

export default EmailTest;

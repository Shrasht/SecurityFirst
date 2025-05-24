# Updated EmailJS Template for Emergency Alerts

Use this template in your EmailJS dashboard. Replace your current template with this improved version:

## Subject Line:

```
🚨 EMERGENCY ALERT from {{user_name}} - Immediate Assistance Needed
```

## Template Body:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .emergency-header {
        background: #d32f2f;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      .location-section {
        background: #f5f5f5;
        padding: 15px;
        margin: 20px 0;
        border-radius: 5px;
      }
      .map-image {
        max-width: 100%;
        height: auto;
        border: 2px solid #ddd;
        border-radius: 5px;
      }
      .urgent {
        color: #d32f2f;
        font-weight: bold;
      }
      .button {
        background: #d32f2f;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        margin: 10px 0;
      }
    </style>
  </head>
  <body>
    <div class="emergency-header">
      <h1>🚨 EMERGENCY ALERT</h1>
      <p>Received at {{time}}</p>
    </div>

    <div class="content">
      <p>Dear {{contact_name}},</p>

      <p class="urgent">This is an emergency alert from {{user_name}}.</p>

      <p>
        <strong>Emergency Message:</strong><br />
        {{emergency_message}}
      </p>

      <div class="location-section">
        <h3>📍 Current Location</h3>
        <p><strong>Address:</strong> {{location_address}}</p>
        <p><strong>Coordinates:</strong> {{location_coordinates}}</p>
        <p><strong>Phone:</strong> {{user_phone}}</p>

        <a href="{{google_maps_url}}" class="button" target="_blank">
          🗺️ View Location on Google Maps
        </a>

        {{#map_image_url}}
        <div style="margin-top: 15px;">
          <img src="{{map_image_url}}" alt="Location Map" class="map-image" />
        </div>
        {{/map_image_url}}
      </div>

      <p><strong>What to do:</strong></p>
      <ol>
        <li>Try to contact {{user_name}} immediately at {{user_phone}}</li>
        <li>
          If you cannot reach them, consider contacting emergency services
        </li>
        <li>Use the map link above to see their exact location</li>
      </ol>

      <p style="color: #666; font-size: 12px;">
        If you received this message by mistake, please ignore it. This alert
        was sent automatically by the SafetyFirst emergency system at {{time}}.
      </p>

      <p>
        Stay safe,<br />
        <strong>SafetyFirst Emergency System</strong>
      </p>
    </div>
  </body>
</html>
```

## Simple Text Version (Alternative):

If you prefer a simpler text version, use this:

```
🚨 EMERGENCY ALERT 🚨
Received: {{time}}

Dear {{contact_name}},

This is an emergency alert from {{user_name}}.

Message: {{emergency_message}}

📍 LOCATION INFORMATION:
Address: {{location_address}}
Coordinates: {{location_coordinates}}
Phone: {{user_phone}}

🗺️ View location on map: {{google_maps_url}}

WHAT TO DO:
1. Try to contact {{user_name}} immediately at {{user_phone}}
2. If you cannot reach them, consider contacting emergency services
3. Use the map link above to see their exact location

If you received this message by mistake, please ignore it.

Stay safe,
SafetyFirst Emergency System
Alert sent at: {{time}}
```

## Variables Used:

- {{name}} - Sender's name
- {{time}} - Timestamp when alert was sent
- {{contact_name}} - Recipient's name
- {{user_name}} - Sender's name (used multiple times)
- {{emergency_message}} - Custom emergency message
- {{location_address}} - Human-readable address
- {{location_coordinates}} - Lat/Lng coordinates
- {{user_phone}} - Sender's phone number
- {{google_maps_url}} - Link to Google Maps
- {{map_image_url}} - URL to static map image (optional)

## Instructions:

1. Go to your EmailJS dashboard
2. Edit your current template (template_k0oohzo)
3. Replace the content with one of the templates above
4. Save the template
5. Test the emergency alert system

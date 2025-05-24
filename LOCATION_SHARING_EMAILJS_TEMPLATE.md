# Location Sharing EmailJS Template

## Template Format for Location Sharing Feature

Your EmailJS template should use this format for location sharing (different from emergency alerts):

### Subject Line:

```
Location Update from {{user_name}}
```

### Email Body (HTML):

```html
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #2196f3;">📍 Location Sharing</h2>

  <p>
    <strong>{{user_name}}</strong> is sharing their location with you at
    <strong>{{timestamp}}</strong>.
  </p>

  <div
    style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 15px 0;"
  >
    📍 <strong>Current Location:</strong> {{user_location}}<br />
    🔗
    <a href="{{google_maps_url}}" style="color: #1976d2; font-weight: bold;"
      >Track on Google Maps</a
    ><br />
    🔗 <a href="{{here_maps_url}}" style="color: #1976d2;">View on HERE Maps</a>
  </div>

  <div
    style="background: #f3e5f5; padding: 15px; border-left: 4px solid #9c27b0; margin: 15px 0;"
  >
    💬 <strong>Message:</strong> {{message}}
  </div>

  <p style="color: #666; font-size: 0.9em;">
    This is a location sharing notification from the Safety App. You can track
    their current position using the Google Maps link above.
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
  <p style="color: #999; font-size: 0.8em;">
    Safety App Location Sharing<br />
    Contact Details: {{user_phone}}<br />
    Coordinates: {{location_coordinates}}
  </p>
</div>
```

### Plain Text Version:

```
📍 LOCATION SHARING 📍

{{user_name}} is sharing their location with you at {{timestamp}}.

📍 Current Location: {{user_location}}
🔗 Track on Google Maps: {{google_maps_url}}
🔗 View on HERE Maps: {{here_maps_url}}

💬 Message: {{message}}

This is a location sharing notification from the Safety App.
You can track their current position using the Google Maps link above.

---
Safety App Location Sharing
Contact Details: {{user_phone}}
Coordinates: {{location_coordinates}}
```

## Required Template Variables

For location sharing, make sure your EmailJS template includes these variables:

- `{{user_name}}` - Name of the person sharing their location
- `{{timestamp}}` - When the location was shared (formatted date/time)
- `{{user_location}}` - Human-readable location description or coordinates
- `{{message}}` - Custom message (default: "This is my current location, track me")
- `{{google_maps_url}}` - Link to track location on Google Maps
- `{{here_maps_url}}` - Link to view location on HERE Maps
- `{{user_phone}}` - User's phone number (optional)
- `{{location_coordinates}}` - Exact lat/lng coordinates
- `{{contact_name}}` - Name of the person receiving the location

## Difference from Emergency Template

**Location Sharing:**

- Uses blue/purple color scheme (calmer)
- Subject: "Location Update from {{user_name}}"
- Message: "This is my current location, track me"
- Tone: Informational, tracking-focused

**Emergency Alerts:**

- Uses red color scheme (urgent)
- Subject: "Emergency Alert from {{user_name}}"
- Message: Emergency-specific content
- Tone: Urgent, help-focused

## EmailJS Template Setup

If you want separate templates for location sharing vs emergency:

1. Go to https://dashboard.emailjs.com
2. Create a new template ID: `template_location_share`
3. Copy the location sharing HTML above into the Content field
4. Update your app to use different template IDs for different features

Or use the same template (`template_k0oohzo`) and let the message content differentiate the purpose.

## Testing

After updating your template:

1. Go to `/share-location-debug` in your app
2. Test the location sharing functionality
3. Check that emails arrive with proper formatting
4. Verify the Google Maps tracking link works correctly

This provides a friendlier, non-emergency tone for regular location sharing while maintaining the same functionality.

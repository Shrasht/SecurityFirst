# Emergency Alert EmailJS Template

## Template Format for Emergency Notifications

Your EmailJS template should use this exact format to match the parameters being sent by both Emergency and Location Sharing features:

### Subject Line:

```
Emergency Alert from {{user_name}}
```

### Email Body (HTML):

```html
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #e74c3c;">Alert</h2>

  <p>
    <strong>{{user_name}}</strong> has triggered an alert at
    <strong>{{timestamp}}</strong>.
  </p>

  <div
    style="background: #f8f9fa; padding: 15px; border-left: 4px solid #e74c3c; margin: 15px 0;"
  >
    📍 <strong>Location:</strong> {{user_location}}<br />
    🔗 <a href="{{here_maps_url}}" style="color: #3498db;">View on HERE Maps</a
    ><br />
    🔗
    <a href="{{google_maps_url}}" style="color: #3498db;"
      >View on Google Maps</a
    >
  </div>

  <div
    style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0;"
  >
    📝 <strong>Message:</strong> {{message}}
  </div>
  <p style="color: #666; font-size: 0.9em;">
    This is an automated emergency notification from the Safety App. Please
    respond if you can assist or acknowledge receipt.
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
  <p style="color: #999; font-size: 0.8em;">
    Safety App Emergency System<br />
    Contact Details: {{user_phone}}<br />
    Coordinates: {{location_coordinates}}
  </p>
</div>
```

### Plain Text Version:

```
🚨 EMERGENCY ALERT 🚨

{{user_name}} has triggered an alert at {{timestamp}}.

📍 Location: {{user_location}}
🔗 View on HERE Maps: {{here_maps_url}}
🔗 View on Google Maps: {{google_maps_url}}

📝 Message: {{message}}

This is an automated emergency notification from the Safety App.
Please respond if you can assist or acknowledge receipt.

---
Safety App Emergency System
Contact Details: {{user_phone}}
Coordinates: {{location_coordinates}}
```

## Required Template Variables

Make sure your EmailJS template includes these exact variable names:

- `{{user_name}}` - Name of the person who triggered the emergency alert
- `{{timestamp}}` - When the emergency alert was triggered (formatted date/time)
- `{{user_location}}` - Human-readable location description or coordinates
- `{{message}}` - Emergency message from the user
- `{{here_maps_url}}` - Link to view location on HERE Maps
- `{{google_maps_url}}` - Link to view location on Google Maps
- `{{user_phone}}` - User's phone number (optional)
- `{{location_coordinates}}` - Exact lat/lng coordinates
- `{{contact_name}}` - Name of the emergency contact receiving the email

## EmailJS Template Setup

1. Go to https://dashboard.emailjs.com
2. Navigate to Email Templates
3. Edit template ID: `template_k0oohzo`
4. Copy the HTML version above into the Content field
5. Make sure all variables are exactly as listed above
6. Test the template using the email debug page in your app

## Testing

After updating your template:

1. Go to `/email-debug` in your app
2. Test the emergency alert functionality
3. Check that emails arrive with proper formatting
4. Verify all links work correctly

## Alternative Minimal Template

If you prefer a simpler format:

```
Subject: Emergency Alert from {{user_name}}

{{user_name}} has triggered an emergency alert at {{timestamp}}.

📍 Location: {{user_location}}
🔗 View on Maps: {{here_maps_url}}
📝 Message: {{message}}

Please respond if you can assist or acknowledge receipt.
```

This matches exactly with the parameters your app is sending and provides a clean, professional emergency notification format.

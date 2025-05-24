# EmailJS Setup Guide for Safety App

## Current Configuration

- **Service ID:** service_1l9sc5j
- **Template ID:** template_k0oohzo
- **Public Key:** Sztbu2xNTjpP_dAyq

## Issue Analysis

Your emails show as "sent successfully" but don't actually arrive. This typically means:

1. **EmailJS template variables don't match** what you're sending
2. **Email service not properly configured** in EmailJS dashboard
3. **Rate limiting** or account issues

## Step-by-Step Fix

### 1. Check EmailJS Dashboard

Go to https://dashboard.emailjs.com and:

- Verify service "service_1l9sc5j" exists and is connected to your email provider
- Check if there are any error logs
- Verify your account isn't hitting rate limits (200 emails/month for free)

### 2. Create/Update Email Template

In your EmailJS dashboard, template "template_k0oohzo" should have this structure:

```html
Subject: Emergency Alert from {{from_name}} Dear {{to_name}}, This is an
emergency notification from the Safety App. User: {{user_name}} Message:
{{message}} Location: {{user_location}} Time: {{timestamp}} Google Maps Link:
{{google_maps_url}} Please respond if you can assist. Best regards, Safety App
Team
```

### 3. Required Template Variables

Make sure your template includes these variables:

- `{{to_name}}` - Recipient name
- `{{from_name}}` - Sender name
- `{{user_name}}` - Emergency contact name
- `{{message}}` - Emergency message
- `{{user_location}}` - Location details
- `{{timestamp}}` - When alert was sent
- `{{google_maps_url}}` - Link to location on maps

### 4. Email Service Setup

In EmailJS dashboard, make sure your email service is properly configured:

- **Gmail:** Use App Password, not regular password
- **Outlook:** Enable SMTP access
- **Other providers:** Check SMTP settings

### 5. Test Variables

The app sends these parameters - make sure they match your template:

```javascript
{
  to_name: "Contact Name",
  from_name: "Safety App",
  user_name: "User Name",
  message: "Emergency message",
  user_location: "Lat, Lng coordinates",
  timestamp: "2024-01-01T10:00:00Z",
  google_maps_url: "https://maps.google.com/?q=lat,lng",
  reply_to: "noreply@safetyapp.com"
}
```

## Testing Steps

1. **Go to /email-debug** in your app
2. **Run the connection test** first
3. **Try the minimal test** to check basic functionality
4. **Send to your real email** to verify delivery

## Common Issues & Solutions

### Issue: Template Variables Don't Match

**Solution:** Update your EmailJS template to use the exact variable names listed above

### Issue: Email Service Not Connected

**Solution:** Reconnect your email service in EmailJS dashboard with correct credentials

### Issue: Rate Limiting

**Solution:** Check if you've exceeded 200 emails/month on free plan

### Issue: Spam Folder

**Solution:** Check spam/junk folder, add sender to whitelist

### Issue: Wrong Template ID

**Solution:** Verify template ID "template_k0oohzo" exists in your EmailJS account

## Alternative Template (Minimal)

If the above doesn't work, try this minimal template:

```html
Subject: Safety Alert Hello {{to_name}}, {{message}} From: {{from_name}}
```

With these minimal variables:

- `{{to_name}}`
- `{{from_name}}`
- `{{message}}`

## Debug Information

Check browser console and EmailJS dashboard for error messages. The debug page at /email-debug will show detailed information about what's being sent vs. what's failing.

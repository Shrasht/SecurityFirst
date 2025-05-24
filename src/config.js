// Store your HERE Maps API keys here
// You can get an API key by signing up at: https://developer.here.com/
// Fallback to a direct value if the environment variable is not available
export const HERE_MAPS_API_KEY =
  process.env.REACT_APP_HERE_MAPS_API_KEY ||
  "iX6ozBxa5iu1te5t17ppcdJd4HwEXikoncIJgIh7WK8"; // Using the API key directly

// Other environment variables
export const APP_NAME = "SafetyFirst";
export const BASE_API_URL = "https://api.safetyapp.com"; // Replace with your actual API URL

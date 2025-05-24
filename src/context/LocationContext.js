import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const LocationContext = createContext();

// Default Andheri, Mumbai coordinates
const ANDHERI_COORDINATES = {
  lat: 19.1136,
  lng: 72.8697,
  timestamp: new Date().toISOString(),
};

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(ANDHERI_COORDINATES); // Initialize with Andheri
  const [locationHistory, setLocationHistory] = useState([ANDHERI_COORDINATES]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [isBatterySaverMode, setIsBatterySaverMode] = useState(false);
  const [error, setError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false); // Set to false since we have default coordinates
  const [safeRoutes, setSafeRoutes] = useState([]);
  // New states for AI safety features
  const [safetyHeatmap, setSafetyHeatmap] = useState([]);
  const [nearbyHelpPoints, setNearbyHelpPoints] = useState([]);
  const [routeAIAnalysis, setRouteAIAnalysis] = useState(null);
  const [safetyScore, setSafetyScore] = useState(null);
  // Simulate fetching saved places from API
  useEffect(() => {
    // In a real app, this would be an API call
    const dummySavedPlaces = [
      {
        id: 1,
        name: "Home",
        address: "Andheri East, Mumbai",
        lat: 19.1136,
        lng: 72.8697,
      },
      {
        id: 2,
        name: "Work",
        address: "Andheri West, Mumbai",
        lat: 19.1273,
        lng: 72.8361,
      },
      {
        id: 3,
        name: "Mall",
        address: "Infiniti Mall, Andheri West",
        lat: 19.1405,
        lng: 72.8309,
      },
    ];

    setTimeout(() => {
      setSavedPlaces(dummySavedPlaces);
    }, 1000);
  }, []);

  // Track location when sharing is enabled
  useEffect(() => {
    let watchId;

    const trackLocation = () => {
      if (isLocationSharing) {
        setLoadingLocation(true);

        if (navigator.geolocation) {
          const options = {
            enableHighAccuracy: !isBatterySaverMode,
            timeout: 15000,
            maximumAge: isBatterySaverMode ? 60000 : 30000,
          };

          watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const newLocation = {
                lat: latitude,
                lng: longitude,
                timestamp: new Date().toISOString(),
              };

              setCurrentLocation(newLocation);
              setLocationHistory((prev) => [...prev, newLocation]);
              setLoadingLocation(false);
              setError(null);
            },
            (err) => {
              setError(`Error getting location: ${err.message}`);
              setLoadingLocation(false);
            },
            options
          );
        } else {
          setError("Geolocation is not supported by your browser");
          setLoadingLocation(false);
        }
      }
    };

    trackLocation();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isLocationSharing, isBatterySaverMode]);
  // Get current location once on initial load
  useEffect(() => {
    // Set loading state first
    setLoadingLocation(true);
    console.log("Getting user's current location from context...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(
            `Location context: User location found - lat: ${latitude}, lng: ${longitude}`
          );
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            timestamp: new Date().toISOString(),
          });
          setLoadingLocation(false);
        },
        (err) => {
          console.warn(
            `Error getting location: ${err.message}, using default coordinates`
          );
          setError(`Error getting location: ${err.message}`);
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.warn(
        "Geolocation is not supported by your browser, using default coordinates"
      );
      setError("Geolocation is not supported by your browser");
      setLoadingLocation(false);
    }
  }, []);

  // Function to toggle location sharing
  const toggleLocationSharing = () => {
    setIsLocationSharing((prev) => !prev);
  };

  // Function to toggle battery saver mode
  const toggleBatterySaverMode = () => {
    setIsBatterySaverMode((prev) => !prev);
  };

  // Add a new saved place
  const addSavedPlace = (place) => {
    setSavedPlaces((prev) => [...prev, { ...place, id: Date.now() }]);
  };

  // Remove a saved place
  const removeSavedPlace = (placeId) => {
    setSavedPlaces((prev) => prev.filter((place) => place.id !== placeId));
  };

  // Get safe routes between two points with AI analysis
  const getSafeRoutes = useCallback(
    async (origin, destination) => {
      try {
        setLoadingLocation(true);

        // In a real app, this would call the HERE Routing API
        // and then pass the routes to our AI model for safety analysis

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate AI analysis results with safety scores
        const mockSafeRoutes = [
          {
            id: 1,
            name: "Safest Route",
            distance: "3.2 km",
            duration: "12 min",
            safetyScore: 95,
            safetyAnalysis: {
              wellLit: true,
              crowdedness: "Medium",
              policeProximity: "High",
              historicalIncidents: "Low",
              timeOfDayRisk: "Low",
            },
            color: "#4CAF50",
            points: [
              { lat: origin.lat, lng: origin.lng },
              { lat: origin.lat + 0.01, lng: origin.lng + 0.01 },
              { lat: destination.lat - 0.01, lng: destination.lng - 0.01 },
              { lat: destination.lat, lng: destination.lng },
            ],
          },
          {
            id: 2,
            name: "Fastest Route",
            distance: "2.8 km",
            duration: "10 min",
            safetyScore: 80,
            safetyAnalysis: {
              wellLit: false,
              crowdedness: "Low",
              policeProximity: "Medium",
              historicalIncidents: "Medium",
              timeOfDayRisk: "Medium",
            },
            color: "#FFC107",
            points: [
              { lat: origin.lat, lng: origin.lng },
              { lat: origin.lat + 0.005, lng: origin.lng + 0.005 },
              { lat: destination.lat - 0.005, lng: destination.lng - 0.005 },
              { lat: destination.lat, lng: destination.lng },
            ],
          },
          {
            id: 3,
            name: "Alternative Route",
            distance: "3.5 km",
            duration: "14 min",
            safetyScore: 65,
            safetyAnalysis: {
              wellLit: false,
              crowdedness: "Very Low",
              policeProximity: "Low",
              historicalIncidents: "High",
              timeOfDayRisk: "High",
            },
            color: "#F44336",
            points: [
              { lat: origin.lat, lng: origin.lng },
              { lat: origin.lat - 0.008, lng: origin.lng + 0.003 },
              { lat: origin.lat - 0.002, lng: origin.lng + 0.007 },
              { lat: destination.lat, lng: destination.lng },
            ],
          },
        ];

        // Generate a heatmap of unsafe areas
        const mockHeatmapData = generateMockSafetyHeatmap(origin, destination);
        setSafetyHeatmap(mockHeatmapData);

        // Get nearby help points
        const mockHelpPoints = await getNearbyHelpPoints(currentLocation);
        setNearbyHelpPoints(mockHelpPoints);

        // Set route analysis
        setRouteAIAnalysis({
          safetyRecommendation:
            "Take the safest route as it has better lighting and police proximity.",
          timeOfDay: "Evening increases risk in certain areas.",
          generalAdvice: "Stay on main streets with better lighting.",
        });

        setSafeRoutes(mockSafeRoutes);
        setLoadingLocation(false);
        return mockSafeRoutes;
      } catch (err) {
        setError("Failed to calculate safe routes: " + err.message);
        setLoadingLocation(false);
        return [];
      }
    },
    [currentLocation]
  );

  // Generate mock safety heatmap data
  const generateMockSafetyHeatmap = (origin, destination) => {
    // In real app, this would come from ML model analyzing area safety
    const centerLat = (origin.lat + destination.lat) / 2;
    const centerLng = (origin.lng + destination.lng) / 2;

    // Generate points with varying weights (safety levels)
    const heatmapData = [];

    // Add some unsafe areas (higher weight = more unsafe)
    for (let i = 0; i < 5; i++) {
      const lat = centerLat + (Math.random() - 0.5) * 0.02;
      const lng = centerLng + (Math.random() - 0.5) * 0.02;
      heatmapData.push({
        location: new window.google.maps.LatLng(lat, lng),
        weight: Math.floor(Math.random() * 5) + 6, // Scale 6-10 (unsafe)
      });
    }

    // Add some safer areas (lower weight = safer)
    for (let i = 0; i < 8; i++) {
      const lat = centerLat + (Math.random() - 0.5) * 0.02;
      const lng = centerLng + (Math.random() - 0.5) * 0.02;
      heatmapData.push({
        location: new window.google.maps.LatLng(lat, lng),
        weight: Math.floor(Math.random() * 5) + 1, // Scale 1-5 (safe)
      });
    }

    return heatmapData;
  };

  // Get nearby help points (police, hospitals, etc.)
  const getNearbyHelpPoints = async (location) => {
    if (!location) return [];

    // In a real app, we would call Places API or a custom backend
    // Simulate API call for help points

    // Mock police stations, hospitals, emergency shelters and well-lit areas
    return [
      {
        id: 1,
        name: "Central Police Station",
        type: "police",
        lat: location.lat + 0.007,
        lng: location.lng - 0.005,
        distance: "600m",
      },
      {
        id: 2,
        name: "City Hospital",
        type: "hospital",
        lat: location.lat - 0.006,
        lng: location.lng + 0.008,
        distance: "950m",
      },
      {
        id: 3,
        name: "Women's Shelter",
        type: "shelter",
        lat: location.lat + 0.004,
        lng: location.lng + 0.009,
        distance: "1.2km",
      },
      {
        id: 4,
        name: "24/7 Pharmacy",
        type: "pharmacy",
        lat: location.lat - 0.002,
        lng: location.lng - 0.007,
        distance: "750m",
      },
      {
        id: 5,
        name: "Main Street (Well-lit)",
        type: "lit-area",
        lat: location.lat + 0.001,
        lng: location.lng + 0.001,
        distance: "300m",
      },
    ];
  };

  // Trigger emergency alert and contact nearby help
  const triggerEmergencyAlert = async () => {
    try {
      if (!currentLocation) {
        throw new Error("Cannot determine your location");
      }

      // In a real app, this would:
      // 1. Send your location to emergency contacts
      // 2. Alert nearby authorities if integrated
      // 3. Start recording audio/video for evidence

      // Mock emergency alert
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        success: true,
        message: "Emergency alert sent with your location",
        alertedContacts: 3,
        nearestHelp: "Police - 600m away",
      };
    } catch (err) {
      setError("Failed to send emergency alert: " + err.message);
      return {
        success: false,
        message: err.message,
      };
    }
  };

  // Analyze image for safety (poor lighting, etc.)
  const analyzeAreaSafety = async (imageFile) => {
    try {
      // In a real app, this would upload the image to a computer vision API
      // and return safety analysis

      // Mock image analysis
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        lightingLevel: "Poor",
        crowdedness: "Low",
        safetyScore: 45,
        recommendations: [
          "This area has poor lighting",
          "Few people around - consider an alternative route",
          "Stay on main streets with better visibility",
        ],
      };
    } catch (err) {
      setError("Failed to analyze area safety: " + err.message);
      return null;
    }
  };
  // Calculate a direct route between two points using HERE Maps
  const calculateDirectRoute = useCallback(async (origin, destination) => {
    try {
      setLoadingLocation(true);

      // In a real app, this would call the HERE Routing API
      // For now, we'll create a simple route

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const route = {
        id: Date.now(),
        name: "Direct Route",
        distance: "Calculating...",
        duration: "Calculating...",
        color: "#1976d2", // Primary blue color
        points: [origin, destination],
      };

      setLoadingLocation(false);
      return route;
    } catch (err) {
      console.error("Error calculating direct route:", err);
      setError("Failed to calculate route: " + err.message);
      setLoadingLocation(false);
      return null;
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        locationHistory,
        savedPlaces,
        isLocationSharing,
        isBatterySaverMode,
        loadingLocation,
        error,
        safeRoutes,
        safetyHeatmap,
        nearbyHelpPoints,
        routeAIAnalysis,
        safetyScore,
        toggleLocationSharing,
        toggleBatterySaverMode,
        addSavedPlace,
        removeSavedPlace,
        getSafeRoutes,
        calculateDirectRoute,
        triggerEmergencyAlert,
        analyzeAreaSafety,
        getNearbyHelpPoints,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

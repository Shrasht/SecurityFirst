import React, { useState, useEffect, useContext } from "react";
import {
  FaExchangeAlt,
  FaStar,
  FaDirections,
  FaCar,
  FaWalking,
  FaBicycle,
  FaArrowRight,
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaStop,
  FaMapMarkerAlt,
  FaRoute,
  FaTurnRight,
  FaTurnLeft,
  FaArrowUp,
  FaCompass,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import styles from "./Map.module.css";
import LocationSearch from "./LocationSearch";
import { LocationContext } from "../../context/LocationContext";

const RoutePlanner = ({ onRouteCalculated }) => {
  const { currentLocation, savedPlaces } = useContext(LocationContext);

  const [startLocation, setStartLocation] = useState({
    title: "Current Location",
    position: currentLocation,
    address: "My Location",
  });
  const [endLocation, setEndLocation] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [transportMode, setTransportMode] = useState("car");
  const [navigationInstructions, setNavigationInstructions] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeInstructionIndex, setActiveInstructionIndex] = useState(0);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Update start location when current location changes
  useEffect(() => {
    if (currentLocation) {
      setStartLocation({
        title: "Current Location",
        position: currentLocation,
        address: "My Location",
      });
    }
  }, [currentLocation]);

  const handleStartLocationSelect = (location) => {
    setStartLocation(location);

    // Save to recent searches
    saveToRecentSearches(location.address);
  };

  const handleEndLocationSelect = (location) => {
    setEndLocation(location);

    // Save to recent searches
    saveToRecentSearches(location.address);
  };

  const saveToRecentSearches = (address) => {
    const updatedSearches = [
      address,
      ...recentSearches.filter((item) => item !== address),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const swapLocations = () => {
    if (!endLocation) return;

    const temp = startLocation;
    setStartLocation(endLocation);
    setEndLocation(temp);
  };
  const calculateRoute = async () => {
    if (!startLocation || !endLocation) {
      alert("Please select both start and end locations");
      return;
    }
    try {
      setIsCalculating(true);
      // Use HERE Routing API for real route calculation
      if (!window.H) {
        alert("HERE Maps API not loaded");
        setIsCalculating(false);
        return;
      }
      const platform = new window.H.service.Platform({
        apikey:
          process.env.REACT_APP_HERE_MAPS_API_KEY ||
          require("../../config").HERE_MAPS_API_KEY,
      });
      const router = platform.getRoutingService(null, 8);
      const origin = `${startLocation.position.lat},${startLocation.position.lng}`;
      const destination = `${endLocation.position.lat},${endLocation.position.lng}`;
      const routeParams = {
        routingMode: "fast",
        transportMode: transportMode,
        origin,
        destination,
        return: "polyline,summary,actions,instructions",
        spans: "streetAttributes,speedLimit",
        instructionsFormat: "text",
        language: "en-US",
      };
      router.calculateRoute(
        routeParams,
        (result) => {
          if (result.routes && result.routes.length) {
            const routeDataHere = result.routes[0];
            const points = [];
            const instructions = [];
            // Flatten all polyline points from all sections and extract instructions
            routeDataHere.sections.forEach((section) => {
              if (section.polyline) {
                // Check if polyline is an array or an object with lat/lng properties
                if (Array.isArray(section.polyline)) {
                  section.polyline.forEach((point) => {
                    points.push({ lat: point.lat, lng: point.lng });
                  });
                } else if (typeof section.polyline === "object") {
                  // For HERE Maps API v8, polyline might be a different format
                  // Try to get the shape points from the polyline
                  const polylineShape =
                    section.polyline.polyline || section.polyline;

                  // If it's a string, it might be an encoded polyline
                  if (typeof polylineShape === "string") {
                    console.log("Encoded polyline found, trying to decode");
                    try {
                      // HERE Maps might use flex polyline format
                      // For now, just log the issue and use section points if available
                      console.log("Encoded polyline not supported yet");

                      // If section has a direct points array, use that instead
                      if (section.points && Array.isArray(section.points)) {
                        section.points.forEach((point) => {
                          points.push({ lat: point.lat, lng: point.lng });
                        });
                      }
                    } catch (e) {
                      console.error("Error decoding polyline:", e);
                    }
                  }
                }
              }

              // Process navigation instructions
              if (section.actions) {
                section.actions.forEach((action, index) => {
                  if (action.instruction) {
                    instructions.push({
                      id: index,
                      text: action.instruction,
                      position: action.position
                        ? { lat: action.position.lat, lng: action.position.lng }
                        : null,
                      distance: action.length
                        ? (action.length / 1000).toFixed(1)
                        : null,
                      time: action.duration
                        ? Math.ceil(action.duration / 60)
                        : null,
                      action: action.action || "continue",
                    });
                  }
                });
              }
            });
            const route = {
              id: new Date().getTime(),
              name: `Route to ${endLocation.title || "Destination"}`,
              color: "#1565C0", // Dark blue color
              lineWidth: 8,
              points,
              showInfo: true,
              transportMode: transportMode,
              routingMode: "fast",
              distance: routeDataHere.sections[0].summary.length / 1000, // km
              duration: Math.ceil(
                routeDataHere.sections[0].summary.duration / 60
              ), // min
            };
            const routeData = {
              origin: startLocation.position,
              destination: endLocation.position,
              originAddress: startLocation.address,
              destinationAddress: endLocation.address,
              route: route,
              instructions: instructions,
            };

            // Set navigation instructions
            setNavigationInstructions(instructions);

            onRouteCalculated(routeData);
            saveToRecentSearches(endLocation.address);
          } else {
            alert("No route found.");
          }
          setIsCalculating(false);
        },
        (error) => {
          alert("Failed to calculate route.");
          setIsCalculating(false);
        }
      );
    } catch (error) {
      console.error("Error calculating route:", error);
      alert("Failed to calculate route. Please try again.");
      setIsCalculating(false);
    }
  };

  const handleSavedPlaceSelect = (place) => {
    setEndLocation({
      title: place.name,
      position: { lat: place.lat, lng: place.lng },
      address: place.address,
    });
  };

  const startNavigation = () => {
    if (navigationInstructions.length === 0) {
      alert("Please calculate a route first");
      return;
    }
    setIsNavigating(true);
    setActiveInstructionIndex(0);

    // If the platform supports geolocation tracking, we could start monitoring position here
    if (navigator.geolocation) {
      // You could setup position tracking here
      // This is a simplified example - in a real app you would continuously update the position
      navigator.geolocation.watchPosition(
        (position) => {
          // Update current position and check which instruction is active
          const { latitude, longitude } = position.coords;
          console.log(`Current location: ${latitude}, ${longitude}`);
          // You would typically check which instruction is closest to the current position
        },
        (error) => {
          console.error("Error getting location updates:", error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setActiveInstructionIndex(0);
    // Clean up any geolocation watchers if needed
  };

  const nextInstruction = () => {
    if (activeInstructionIndex < navigationInstructions.length - 1) {
      setActiveInstructionIndex(activeInstructionIndex + 1);
    }
  };

  const previousInstruction = () => {
    if (activeInstructionIndex > 0) {
      setActiveInstructionIndex(activeInstructionIndex - 1);
    }
  };

  return (
    <div className={styles.routePlannerContainer}>
      <div className={styles.routePlannerInputs}>
        <div className={styles.locationInput}>
          <label>Start</label>
          <LocationSearch
            onSelectLocation={handleStartLocationSelect}
            placeholder="Enter start location"
            defaultValue={startLocation?.address}
            recentLocations={recentSearches}
          />
        </div>

        <button
          className={styles.swapButton}
          onClick={swapLocations}
          aria-label="Swap locations"
        >
          <FaExchangeAlt />
        </button>

        <div className={styles.locationInput}>
          <label>Destination</label>
          <LocationSearch
            onSelectLocation={handleEndLocationSelect}
            placeholder="Enter destination"
            defaultValue={endLocation?.address}
            recentLocations={recentSearches}
          />
        </div>
      </div>
      {savedPlaces.length > 0 && (
        <div className={styles.savedPlacesBar}>
          <div className={styles.savedPlacesTitle}>Saved Places:</div>
          <div className={styles.savedPlacesScroll}>
            {savedPlaces.map((place) => (
              <div
                key={place.id}
                className={styles.savedPlaceTag}
                onClick={() => handleSavedPlaceSelect(place)}
              >
                <FaStar className={styles.starIcon} />
                {place.name}
              </div>
            ))}
          </div>
        </div>
      )}{" "}
      <div className={styles.transportModeContainer}>
        <div className={styles.transportModeTitle}>Transport Mode:</div>
        <div className={styles.transportModeOptions}>
          <button
            className={`${styles.transportModeButton} ${
              transportMode === "car" ? styles.active : ""
            }`}
            onClick={() => setTransportMode("car")}
            aria-label="Car"
          >
            <FaCar />
          </button>
          <button
            className={`${styles.transportModeButton} ${
              transportMode === "pedestrian" ? styles.active : ""
            }`}
            onClick={() => setTransportMode("pedestrian")}
            aria-label="Walking"
          >
            <FaWalking />
          </button>
          <button
            className={`${styles.transportModeButton} ${
              transportMode === "bicycle" ? styles.active : ""
            }`}
            onClick={() => setTransportMode("bicycle")}
            aria-label="Bicycle"
          >
            <FaBicycle />
          </button>
        </div>
      </div>
      <button
        className={styles.calculateButton}
        onClick={calculateRoute}
        disabled={!startLocation || !endLocation || isCalculating}
      >
        {isCalculating ? "Calculating..." : "Calculate Route"}
      </button>
      {navigationInstructions.length > 0 && (
        <div className={styles.navigationContainer}>
          {!isNavigating ? (
            <button
              className={styles.startNavigationButton}
              onClick={startNavigation}
            >
              <FaDirections /> Start Navigation
            </button>
          ) : (
            <div className={styles.navigationControlsContainer}>
              <div className={styles.navigationHeader}>
                <h3>Turn-by-Turn Directions</h3>
                <button
                  className={styles.stopNavigationButton}
                  onClick={stopNavigation}
                >
                  Stop
                </button>
              </div>

              <div className={styles.currentInstruction}>
                {navigationInstructions[activeInstructionIndex] && (
                  <>
                    <div className={styles.instructionIcon}>
                      <FaArrowRight />
                    </div>
                    <div className={styles.instructionText}>
                      {navigationInstructions[activeInstructionIndex].text}
                      {navigationInstructions[activeInstructionIndex]
                        .distance && (
                        <div className={styles.instructionDistance}>
                          {
                            navigationInstructions[activeInstructionIndex]
                              .distance
                          }{" "}
                          km
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className={styles.navigationControls}>
                <button
                  onClick={previousInstruction}
                  disabled={activeInstructionIndex === 0}
                  className={styles.navControlButton}
                >
                  Previous
                </button>
                <span className={styles.instructionCounter}>
                  {activeInstructionIndex + 1} / {navigationInstructions.length}
                </span>
                <button
                  onClick={nextInstruction}
                  disabled={
                    activeInstructionIndex === navigationInstructions.length - 1
                  }
                  className={styles.navControlButton}
                >
                  Next
                </button>
              </div>

              <div className={styles.instructionsList}>
                {navigationInstructions.map((instruction, index) => (
                  <div
                    key={instruction.id}
                    className={`${styles.instructionItem} ${
                      index === activeInstructionIndex
                        ? styles.activeInstruction
                        : ""
                    }`}
                    onClick={() => setActiveInstructionIndex(index)}
                  >
                    <div className={styles.instructionItemNumber}>
                      {index + 1}
                    </div>
                    <div className={styles.instructionItemText}>
                      {instruction.text}
                      {instruction.distance && (
                        <div className={styles.instructionItemDistance}>
                          {instruction.distance} km
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;

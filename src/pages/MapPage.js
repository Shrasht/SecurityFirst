import React, { useState, useEffect, useContext } from "react";
import { LocationContext } from "../context/LocationContext";
import HereMap from "../components/map/HereMap";
import MapErrorBoundary from "../components/map/MapErrorBoundary";
import { FaMapMarkedAlt, FaRoute, FaLayerGroup } from "react-icons/fa";
import styles from "./MapPage.module.css";

const MapPage = () => {
  const { currentLocation } = useContext(LocationContext);
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showTraffic, setShowTraffic] = useState(false);
  // Initialize markers when location is available
  useEffect(() => {
    if (currentLocation) {
      setMarkers([
        {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          title: "Your Current Location",
          isCurrentLocation: true,
          size: "large", // Make marker larger
        },
      ]);
    }
  }, [currentLocation]);

  // Toggle traffic layer visibility
  const toggleTraffic = () => {
    setShowTraffic((prevState) => !prevState);
  };
  // Add sample destination marker (for demo purposes)
  const addDestination = () => {
    if (currentLocation) {
      // Add a destination marker slightly offset from current location
      const newMarker = {
        lat: currentLocation.lat + 0.01,
        lng: currentLocation.lng + 0.01,
        title: "Sample Destination",
        type: "destination",
        size: "large", // Make marker larger
      };

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

      // Add a route between current location and destination
      setRoutes([
        {
          points: [
            { lat: currentLocation.lat, lng: currentLocation.lng },
            {
              lat: currentLocation.lat + 0.01,
              lng: currentLocation.lng + 0.01,
            },
          ],
        },
      ]);
    }
  };

  return (
    <div className={styles.mapPageContainer}>
      <div className={styles.mapControls}>
        <button className={styles.mapButton} onClick={addDestination}>
          <FaRoute /> Add Sample Route
        </button>
        <button
          className={`${styles.mapButton} ${showTraffic ? styles.active : ""}`}
          onClick={toggleTraffic}
        >
          <FaLayerGroup /> {showTraffic ? "Hide Traffic" : "Show Traffic"}
        </button>
      </div>

      <div className={styles.mapContainer}>
        <MapErrorBoundary>
          <HereMap
            center={currentLocation}
            zoom={14}
            markers={markers}
            routes={routes}
            showTraffic={showTraffic}
          />
        </MapErrorBoundary>
      </div>
    </div>
  );
};

export default MapPage;

import React, { useState, useEffect, useContext } from "react";
import HereMap from "./HereMap";
import RoutePlanner from "./RoutePlanner";
import styles from "./Map.module.css";
import { LocationContext } from "../../context/LocationContext";

const MapWithRoutePlanner = ({
  height = "900px", // Increased from 700px to 900px for larger map display
  showRouteControls = true,
  externalRoutes = null,
  externalMarkers = null,
  forceUpdate = null,
}) => {
  const { currentLocation } = useContext(LocationContext);
  const [center, setCenter] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [zoom, setZoom] = useState(14);
  const [showTraffic, setShowTraffic] = useState(false); // Set center to current location when it changes
  useEffect(() => {
    if (currentLocation) {
      setCenter(currentLocation);

      // Add current location marker only if no external markers
      if (!externalMarkers) {
        updateMarkers(currentLocation);
      }
    }
  }, [currentLocation, externalMarkers]); // Handle external routes and markers
  useEffect(() => {
    console.log("🗺️ MapWithRoutePlanner received external data:", {
      externalRoutes: externalRoutes?.length || 0,
      externalMarkers: externalMarkers?.length || 0,
      forceUpdate,
      routesData: externalRoutes,
      markersData: externalMarkers,
    });

    if (externalRoutes && externalRoutes.length > 0) {
      console.log("🛣️ Setting external routes:", externalRoutes);
      setRoutes(externalRoutes);
    }
    if (externalMarkers && externalMarkers.length > 0) {
      console.log("📍 Setting external markers:", externalMarkers);
      setMarkers(externalMarkers);
      // Set center to the midpoint of origin and destination
      if (externalMarkers.length >= 2) {
        const originMarker = externalMarkers.find((m) => m.type === "origin");
        const destMarker = externalMarkers.find(
          (m) => m.type === "destination"
        );
        if (originMarker && destMarker) {
          const midLat = (originMarker.lat + destMarker.lat) / 2;
          const midLng = (originMarker.lng + destMarker.lng) / 2;
          setCenter({ lat: midLat, lng: midLng });
          console.log("🎯 Setting center to midpoint:", {
            lat: midLat,
            lng: midLng,
          });
        }
      }
    }
  }, [externalRoutes, externalMarkers, forceUpdate]);
  // Handle route calculation with enhanced visual feedback
  const handleRouteCalculated = (routeData) => {
    const {
      origin,
      destination,
      originAddress,
      destinationAddress,
      route,
      instructions,
    } = routeData; // Use the provided route or create a new one with enhanced styling
    const newRoute = route || {
      id: new Date().getTime(),
      name: `Route to ${destinationAddress}`,
      color: "#1565C0", // Dark blue for route visibility
      lineWidth: 8,
      points: [
        { lat: origin.lat, lng: origin.lng },
        { lat: destination.lat, lng: destination.lng },
      ],
      showInfo: true, // Show route information bubble
      instructions: instructions, // Store navigation instructions with the route
    };

    console.log("Setting up route:", JSON.stringify(newRoute));
    console.log("Route points:", JSON.stringify(newRoute.points));
    console.log(
      "Navigation instructions:",
      instructions ? instructions.length : 0
    );
    setRoutes([newRoute]);

    // Create styled markers for start and end points
    const routeMarkers = [
      {
        lat: origin.lat,
        lng: origin.lng,
        title: originAddress || "Starting Point",
        isCurrentLocation: originAddress === "My Location",
        zIndex: 100, // Higher z-index to ensure visibility
        type: "origin",
      },
      {
        lat: destination.lat,
        lng: destination.lng,
        title: destinationAddress || "Destination",
        type: "destination",
        zIndex: 100,
      },
    ];

    setMarkers(routeMarkers);

    // Let the HereMap component handle the viewport focusing automatically
    // No need to manually set center or zoom - the processRoutes function will handle this

    // Show traffic layer for longer routes to provide useful context
    setTimeout(() => {
      if (
        Math.abs(destination.lat - origin.lat) > 0.02 ||
        Math.abs(destination.lng - origin.lng) > 0.02
      ) {
        setShowTraffic(true);
      }
    }, 800); // Delay to allow route rendering to complete first
  };
  const updateMarkers = (location) => {
    if (!location) return;

    console.log(
      `Updating markers with location: lat ${location.lat}, lng ${location.lng}`
    );

    // Always show current location marker, regardless of routes
    if (routes.length === 0) {
      // If no routes, just show current location
      setMarkers([
        {
          lat: location.lat,
          lng: location.lng,
          title: "My Location",
          isCurrentLocation: true,
          type: "origin",
        },
      ]);
    } else {
      // If there are routes, ensure the current location marker is included in the markers
      const hasCurrentLocation = markers.some((m) => m.isCurrentLocation);

      if (!hasCurrentLocation) {
        setMarkers((prevMarkers) => [
          ...prevMarkers,
          {
            lat: location.lat,
            lng: location.lng,
            title: "My Location",
            isCurrentLocation: true,
            type: "origin",
          },
        ]);
      }
    }
  };

  const toggleTraffic = () => {
    setShowTraffic((prev) => !prev);
  };

  return (
    <div className={styles.mapWithRoutePlannerContainer}>
      {showRouteControls && (
        <RoutePlanner onRouteCalculated={handleRouteCalculated} />
      )}{" "}
      <div className={styles.mapContainerWithPlanner} style={{ height }}>
        {console.log("Passing to HereMap:", {
          center,
          zoom,
          markers,
          routes,
          showTraffic,
        })}
        <HereMap
          center={center}
          zoom={zoom}
          markers={markers}
          routes={routes}
          showTraffic={showTraffic}
        />

        {routes.length > 0 && (
          <div className={styles.routeControlsOverlay}>
            <button
              className={`${styles.trafficButton} ${
                showTraffic ? styles.active : ""
              }`}
              onClick={toggleTraffic}
            >
              {showTraffic ? "Hide Traffic" : "Show Traffic"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapWithRoutePlanner;

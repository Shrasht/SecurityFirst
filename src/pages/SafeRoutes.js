import React, { useState, useContext, useEffect } from "react";
import { LocationContext } from "../context/LocationContext";
import { AuthContext } from "../context/AuthContext";
import styles from "./SafeRoutes.module.css";
import MapWithRoutePlanner from "../components/map/MapWithRoutePlanner";
import {
  FaSearch,
  FaRoute,
  FaShieldAlt,
  FaLightbulb,
  FaExclamationTriangle,
  FaClock,
  FaLocationArrow,
  FaHistory,
} from "react-icons/fa";
import RouteCard from "../components/routes/RouteCard";
import HelpPointsPanel from "../components/safety/HelpPointsPanel";

const SafeRoutes = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    currentLocation,
    getSafeRoutes,
    safeRoutes,
    loadingLocation,
    safetyHeatmap,
    nearbyHelpPoints,
    routeAIAnalysis,
  } = useContext(LocationContext);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showHelpPoints, setShowHelpPoints] = useState(true);
  const [recentDestinations, setRecentDestinations] = useState([]);
  const [mapRoutes, setMapRoutes] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  // Load recent destinations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentDestinations");
    if (saved) {
      setRecentDestinations(JSON.parse(saved));
    }
  }, []); // Set current location as default origin
  useEffect(() => {
    if (currentLocation) {
      setOrigin(
        `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`
      );
    }
  }, [currentLocation]);
  const handleSearch = async () => {
    if (!origin || !destination) {
      console.warn("Search called without origin or destination:", {
        origin,
        destination,
      });
      return;
    }

    console.log("🔍 Starting search with:", { origin, destination });

    // Parse coordinates or use geocoding service in real app
    let originCoords = parseCoordinates(origin) || currentLocation;
    let destCoords = parseCoordinates(destination);

    console.log("📍 Parsed coordinates:", {
      originCoords,
      destCoords,
      currentLocation,
      originInput: origin,
      destinationInput: destination,
    });

    if (!originCoords) {
      alert("Please enter a valid origin location or coordinates");
      console.error("❌ Invalid origin coordinates");
      return;
    }

    if (!destCoords) {
      alert("Please enter a valid destination address or coordinates");
      console.error("❌ Invalid destination coordinates");
      return;
    }

    // Save destination to recent list
    const newDestinations = [...recentDestinations];
    // Add if not already in the list
    if (!newDestinations.some((d) => d === destination)) {
      newDestinations.unshift(destination);
      if (newDestinations.length > 5) newDestinations.pop(); // Keep only 5 most recent
      setRecentDestinations(newDestinations);
      localStorage.setItem(
        "recentDestinations",
        JSON.stringify(newDestinations)
      );
    }

    try {
      console.log("🛣️ Calling getSafeRoutes with:", {
        originCoords,
        destCoords,
      });

      // Get safe routes with AI analysis
      const routes = await getSafeRoutes(originCoords, destCoords);
      console.log("✅ Received routes from getSafeRoutes:", routes);

      if (routes.length > 0) {
        setSelectedRoute(routes[0]);
        console.log("🎯 Selected first route as default:", routes[0]);
      }

      // Store coordinates for map
      setOriginCoords(originCoords);
      setDestinationCoords(destCoords);
      console.log("💾 Stored coordinates for map:", {
        originCoords,
        destCoords,
      });

      // Create markers for map
      const newMarkers = [
        {
          lat: originCoords.lat,
          lng: originCoords.lng,
          title: "Starting Point",
          isCurrentLocation: originCoords === currentLocation,
          type: "origin",
          size: "large",
        },
        {
          lat: destCoords.lat,
          lng: destCoords.lng,
          title: `Destination: ${destination}`,
          type: "destination",
          size: "large",
        },
      ];
      console.log("📍 Created markers for map:", newMarkers);
      setMapMarkers(newMarkers);

      // Create routes for map with safety-based colors
      if (routes.length > 0) {
        const mapRoutesData = routes.map((route, index) => {
          const isSafestRoute = index === 0; // First route is the safest
          return {
            id: route.id || `route-${index}`,
            name: route.name || `Route ${index + 1}`,
            color: isSafestRoute
              ? "#2E7D32"
              : getSafetyColor(route.safetyScore), // Dark green for safest route
            lineWidth: isSafestRoute ? 12 : 6, // Make safest route much thicker
            points: route.path ||
              route.points || [
                { lat: originCoords.lat, lng: originCoords.lng },
                { lat: destCoords.lat, lng: destCoords.lng },
              ],
            showInfo: true,
            safetyScore: route.safetyScore,
            duration: route.duration,
            distance: route.distance,
            isSafest: isSafestRoute,
            // Add highlighting properties for safest route
            opacity: isSafestRoute ? 1.0 : 0.7,
            strokeDashArray: isSafestRoute ? null : "10,5", // Dashed line for non-safest routes
            // Add animation properties for safest route
            animateRoute: isSafestRoute,
            shadowColor: isSafestRoute ? "rgba(76, 175, 80, 0.4)" : null,
            glowEffect: isSafestRoute,
          };
        });
        console.log("🗺️ Created map routes data:", mapRoutesData);
        setMapRoutes(mapRoutesData);
      } else {
        console.warn("⚠️ No routes returned from getSafeRoutes");
      }
    } catch (error) {
      console.error("❌ Error in handleSearch:", error);
      alert("Failed to get safe routes. Please try again.");
    }
  };
  const parseCoordinates = (input) => {
    if (!input || typeof input !== "string") {
      console.log("🔍 parseCoordinates: Invalid input:", input);
      return null;
    }

    // Clean the input string
    const cleanInput = input.trim();
    console.log("🔍 parseCoordinates: Parsing input:", cleanInput);

    // Multiple coordinate formats supported:
    // "lat, lng" - basic format with comma
    // "lat,lng" - no space after comma
    // "lat lng" - space separated
    // "(lat, lng)" - parentheses format

    // Try different regex patterns
    const patterns = [
      /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/, // lat, lng or lat,lng
      /^(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)$/, // lat lng (space separated)
      /^\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)$/, // (lat, lng)
    ];

    for (let i = 0; i < patterns.length; i++) {
      const match = cleanInput.match(patterns[i]);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);

        // Validate coordinate ranges
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          console.log("✅ parseCoordinates: Successfully parsed:", {
            lat,
            lng,
          });
          return { lat, lng };
        } else {
          console.warn("⚠️ parseCoordinates: Coordinates out of range:", {
            lat,
            lng,
          });
        }
      }
    }

    console.log(
      "❌ parseCoordinates: No valid pattern matched for:",
      cleanInput
    );
    return null;
  };

  const getSafetyColor = (safetyScore) => {
    if (safetyScore >= 80) return "#4CAF50"; // Green - Very Safe
    if (safetyScore >= 60) return "#FF9800"; // Orange - Moderately Safe
    return "#F44336"; // Red - Higher Risk
  };
  const handleTestRoute = async () => {
    console.log("🧪 Test Route button clicked");

    // Set test coordinates
    const testOrigin = "19.1136, 72.8697"; // Andheri
    const testDestination = "19.1405, 72.8309"; // Bandra

    console.log("🧪 Setting test coordinates:", {
      testOrigin,
      testDestination,
    });

    setOrigin(testOrigin);
    setDestination(testDestination);

    // Parse coordinates immediately
    const originCoords = parseCoordinates(testOrigin);
    const destCoords = parseCoordinates(testDestination);

    console.log("🧪 Parsed test coordinates:", { originCoords, destCoords });

    if (originCoords && destCoords) {
      try {
        console.log("🧪 Calling getSafeRoutes directly...");
        const routes = await getSafeRoutes(originCoords, destCoords);
        console.log("🧪 Got routes:", routes);

        if (routes.length > 0) {
          setSelectedRoute(routes[0]);
          console.log("🧪 Selected first route as default:", routes[0]);
        }

        // Store coordinates for map
        setOriginCoords(originCoords);
        setDestinationCoords(destCoords);
        console.log("🧪 Stored coordinates for map:", {
          originCoords,
          destCoords,
        });

        // Create markers for map
        const newMarkers = [
          {
            lat: originCoords.lat,
            lng: originCoords.lng,
            title: "Test Origin - Andheri",
            type: "origin",
            size: "large",
          },
          {
            lat: destCoords.lat,
            lng: destCoords.lng,
            title: "Test Destination - Bandra",
            type: "destination",
            size: "large",
          },
        ];
        console.log("🧪 Setting test markers:", newMarkers);
        setMapMarkers(newMarkers);

        // Create routes for map with safety-based colors
        if (routes.length > 0) {
          const mapRoutesData = routes.map((route, index) => {
            const isSafestRoute = index === 0; // First route is the safest
            return {
              id: route.id || `route-${index}`,
              name: route.name || `Test Route ${index + 1}`,
              color: isSafestRoute
                ? "#2E7D32"
                : getSafetyColor(route.safetyScore), // Dark green for safest route
              lineWidth: isSafestRoute ? 12 : 6, // Make safest route much thicker
              points: route.path ||
                route.points || [
                  { lat: originCoords.lat, lng: originCoords.lng },
                  { lat: destCoords.lat, lng: destCoords.lng },
                ],
              showInfo: true,
              safetyScore: route.safetyScore,
              duration: route.duration,
              distance: route.distance,
              isSafest: isSafestRoute,
              // Add highlighting properties for safest route
              opacity: isSafestRoute ? 1.0 : 0.7,
              strokeDashArray: isSafestRoute ? null : "10,5", // Dashed line for non-safest routes
              // Add animation properties for safest route
              animateRoute: isSafestRoute,
              shadowColor: isSafestRoute ? "rgba(76, 175, 80, 0.4)" : null,
              glowEffect: isSafestRoute,
            };
          });
          console.log("🧪 Setting test routes:", mapRoutesData);
          setMapRoutes(mapRoutesData);
        } else {
          console.warn(
            "🧪 No routes returned from getSafeRoutes, creating simple test route"
          );
          // Create a simple test route if getSafeRoutes doesn't return anything
          const simpleRoute = {
            id: "test-route-1",
            name: "Test Route",
            color: "#2E7D32",
            lineWidth: 12,
            points: [
              { lat: originCoords.lat, lng: originCoords.lng },
              { lat: destCoords.lat, lng: destCoords.lng },
            ],
            showInfo: true,
            safetyScore: 85,
            duration: "15 min",
            distance: "8.5 km",
            isSafest: true,
            opacity: 1.0,
            strokeDashArray: null,
            animateRoute: true,
            shadowColor: "rgba(76, 175, 80, 0.4)",
            glowEffect: true,
          };
          setMapRoutes([simpleRoute]);
          console.log("🧪 Set simple test route:", simpleRoute);
        }
      } catch (error) {
        console.error("🧪 Test route error:", error);
        // Even if there's an error, create basic test data
        const originCoords = parseCoordinates(testOrigin);
        const destCoords = parseCoordinates(testDestination);

        if (originCoords && destCoords) {
          setOriginCoords(originCoords);
          setDestinationCoords(destCoords);

          const testMarkers = [
            {
              lat: originCoords.lat,
              lng: originCoords.lng,
              title: "Test Origin",
              type: "origin",
              size: "large",
            },
            {
              lat: destCoords.lat,
              lng: destCoords.lng,
              title: "Test Destination",
              type: "destination",
              size: "large",
            },
          ];
          setMapMarkers(testMarkers);

          const testRoute = {
            id: "fallback-test-route",
            name: "Fallback Test Route",
            color: "#2E7D32",
            lineWidth: 10,
            points: [originCoords, destCoords],
            showInfo: true,
            isSafest: true,
            opacity: 1.0,
          };
          setMapRoutes([testRoute]);

          console.log("🧪 Created fallback test data");
        }
      }
    }
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);

    // Update map routes to highlight the selected route
    if (mapRoutes.length > 0) {
      const updatedRoutes = mapRoutes.map((mapRoute, index) => {
        const isSelectedRoute = mapRoute.id === route.id;
        const isSafestRoute = index === 0;

        return {
          ...mapRoute,
          lineWidth: isSelectedRoute ? 15 : isSafestRoute ? 12 : 6, // Extra thick for selected
          color: isSelectedRoute
            ? "#1B5E20"
            : isSafestRoute
            ? "#2E7D32"
            : getSafetyColor(route.safetyScore),
          opacity: isSelectedRoute ? 1.0 : isSafestRoute ? 1.0 : 0.7,
          strokeDashArray: isSelectedRoute
            ? null
            : isSafestRoute
            ? null
            : "10,5",
          // Add special highlighting for selected route
          glowEffect: isSelectedRoute || isSafestRoute,
          shadowColor: isSelectedRoute
            ? "rgba(27, 94, 32, 0.6)"
            : isSafestRoute
            ? "rgba(76, 175, 80, 0.4)"
            : null,
          animateRoute: isSelectedRoute || isSafestRoute,
        };
      });
      setMapRoutes(updatedRoutes);
    }
  };
  return (
    <div className={styles.safeRoutesPage}>
      <div className={styles.searchSection}>
        <h2 className={styles.pageTitle}>
          <FaShieldAlt className={styles.titleIcon} />
          Find Safest Routes
        </h2>
        <p className={styles.pageSubtitle}>
          AI-powered route analysis to keep you safe on your journey
        </p>
        <div className={styles.searchForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="origin">From</label>
            <div className={styles.inputWithIcon}>
              <FaLocationArrow className={styles.inputIcon} />
              <input
                type="text"
                id="origin"
                placeholder="Current location"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="destination">To</label>
            <div className={styles.inputWithIcon}>
              <FaSearch className={styles.inputIcon} />
              <input
                type="text"
                id="destination"
                placeholder="Enter destination address or coordinates"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              {recentDestinations.length > 0 && destination === "" && (
                <div className={styles.recentDropdown}>
                  <div className={styles.recentHeader}>
                    <FaHistory /> Recent Destinations
                  </div>
                  {recentDestinations.map((dest, index) => (
                    <div
                      key={index}
                      className={styles.recentItem}
                      onClick={() => setDestination(dest)}
                    >
                      {dest}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={loadingLocation || !origin || !destination}
          >
            {loadingLocation ? "Analyzing Routes..." : "Find Safest Routes"}
          </button>
        </div>{" "}
        {/* Quick destination shortcuts */}
        <div className={styles.quickDestinations}>
          <h4>Quick Destinations</h4>
          <div className={styles.quickButtons}>
            <button
              className={styles.quickButton}
              onClick={() => setDestination("19.1405, 72.8309")} // Mall
            >
              Mall
            </button>
            <button
              className={styles.quickButton}
              onClick={() => setDestination("19.1273, 72.8361")} // Work area
            >
              Work Area
            </button>
            <button
              className={styles.quickButton}
              onClick={() => setDestination("19.0760, 72.8777")} // Central Mumbai
            >
              City Center
            </button>{" "}
            <button className={styles.quickButton} onClick={handleTestRoute}>
              🧪 Test Route
            </button>
          </div>
        </div>
      </div>{" "}
      <div className={styles.mapSection}>
        <div className={styles.mapContainer}>
          {console.log("🗺️ Rendering MapWithRoutePlanner with:", {
            mapRoutes: mapRoutes.length,
            mapMarkers: mapMarkers.length,
            originCoords,
            destinationCoords,
            currentLocation,
          })}
          <MapWithRoutePlanner
            height="950px"
            showRouteControls={false}
            externalRoutes={mapRoutes}
            externalMarkers={mapMarkers}
            forceUpdate={`${Date.now()}-${mapRoutes.length}-${
              mapMarkers.length
            }`}
            center={
              originCoords || currentLocation || { lat: 19.1136, lng: 72.8697 }
            }
          />
          {mapMarkers.length === 0 && mapRoutes.length === 0 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(255,255,255,0.9)",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
                zIndex: 1000,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <p>
                <strong>🗺️ Map is ready!</strong>
              </p>
              <p>Enter origin and destination coordinates to see routes</p>
              <small>Example: 19.1136, 72.8697</small>
              <br />
              <button
                onClick={handleTestRoute}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                🧪 Click here to test with sample data
              </button>
            </div>
          )}
        </div>
        <div className={styles.mapControls}>
          <div
            className={`${styles.controlButton} ${
              showHeatmap ? styles.active : ""
            }`}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            <FaLightbulb /> Safety Heatmap
          </div>
          <div
            className={`${styles.controlButton} ${
              showHelpPoints ? styles.active : ""
            }`}
            onClick={() => setShowHelpPoints(!showHelpPoints)}
          >
            <FaShieldAlt /> Help Points
          </div>
        </div>
      </div>{" "}
      {safeRoutes.length > 0 && (
        <div className={styles.routesSection}>
          <div className={styles.routesHeader}>
            <h3 className={styles.sectionTitle}>
              <FaRoute className={styles.sectionIcon} />
              Safest Routes to Your Destination
            </h3>
            <div className={styles.routesSubtitle}>
              Routes are ranked by safety score based on AI analysis of
              lighting, crowd density, police proximity, and historical incident
              data.
            </div>
          </div>

          {routeAIAnalysis && (
            <div className={styles.aiInsightsCard}>
              <div className={styles.aiHeader}>
                <FaLightbulb className={styles.aiIcon} />
                <h4>AI Safety Insights</h4>
              </div>
              <div className={styles.aiContent}>
                <p>
                  <strong>Recommendation:</strong>{" "}
                  {routeAIAnalysis.safetyRecommendation}
                </p>
                <p>
                  <strong>Time Factor:</strong> {routeAIAnalysis.timeOfDay}
                </p>
                <p>
                  <strong>General Advice:</strong>{" "}
                  {routeAIAnalysis.generalAdvice}
                </p>
              </div>
            </div>
          )}

          {/* Highlight the safest route */}
          {safeRoutes.length > 0 && (
            <div className={styles.safestRouteHighlight}>
              <div className={styles.highlightHeader}>
                <FaShieldAlt className={styles.highlightIcon} />
                <span>Recommended Safest Route</span>
              </div>{" "}
              <RouteCard
                route={safeRoutes[0]}
                isSelected={selectedRoute?.id === safeRoutes[0].id}
                onSelect={() => handleSelectRoute(safeRoutes[0])}
                isHighlighted={true}
              />
            </div>
          )}

          <div className={styles.routesListHeader}>
            <h4>All Available Routes</h4>
            <span className={styles.routeCount}>
              {safeRoutes.length} routes found
            </span>
          </div>

          <div className={styles.routesList}>
            {safeRoutes.map((route, index) => (
              <div key={route.id} className={styles.routeListItem}>
                <div className={styles.routeRank}>#{index + 1}</div>
                <RouteCard
                  route={route}
                  isSelected={selectedRoute?.id === route.id}
                  onSelect={() => handleSelectRoute(route)}
                />
              </div>
            ))}
          </div>

          {/* Safety legend */}
          <div className={styles.safetyLegend}>
            <h4>Safety Score Legend</h4>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <div className={`${styles.scoreBadge} ${styles.safe}`}>
                  80-100%
                </div>
                <span>
                  Very Safe - Well-lit, high police proximity, low incident
                  history
                </span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.scoreBadge} ${styles.moderate}`}>
                  60-79%
                </div>
                <span>
                  Moderately Safe - Some risk factors, exercise caution
                </span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.scoreBadge} ${styles.unsafe}`}>
                  Below 60%
                </div>
                <span>
                  Higher Risk - Poor lighting or high incident history
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {nearbyHelpPoints.length > 0 && (
        <HelpPointsPanel helpPoints={nearbyHelpPoints} />
      )}
    </div>
  );
};

export default SafeRoutes;

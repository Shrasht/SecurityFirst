import React, { useEffect, useRef, useState } from "react";
import styles from "./Map.module.css";
import { HERE_MAPS_API_KEY } from "../../config";
import { FaLocationArrow, FaLayerGroup } from "react-icons/fa";

// Using HERE Maps API key from config file with fallback
const API_KEY =
  HERE_MAPS_API_KEY || "CauXgVKhpngm08tMwmyfhgh663KesMXyDTX8VQLlxaY";

// Default to Andheri, Mumbai coordinates if no location provided
const ANDHERI_COORDINATES = {
  lat: 19.1136,
  lng: 72.8697,
};

const HereMap = ({
  center,
  zoom = 14,
  markers = [],
  routes = [],
  showTraffic = false,
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapObject, setMapObject] = useState(null);
  const [error, setError] = useState(null);
  const [activeLayer, setActiveLayer] = useState("normal");

  // Load HERE Maps scripts
  useEffect(() => {
    // Skip if HERE Maps is already loaded
    if (window.H) {
      console.log("HERE Maps already loaded, initializing map...");
      initMap();
      return;
    }

    const loadScript = (url) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.async = false; // Sequential loading
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadCSS = (url) => {
      return new Promise((resolve) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        link.onload = resolve;
        document.head.appendChild(link);
      });
    };

    // Load required scripts in the correct order
    const loadMapScripts = async () => {
      try {
        console.log("Loading HERE Maps scripts...");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-core.js");
        console.log("Core script loaded");

        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-service.js");
        console.log("Service script loaded");

        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-mapevents.js");
        console.log("Map events script loaded");

        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-ui.js");
        console.log("UI script loaded");

        await loadCSS("https://js.api.here.com/v3/3.1/mapsjs-ui.css");
        console.log("CSS loaded");

        // Add a small delay to ensure all scripts are fully initialized
        setTimeout(() => {
          console.log("All scripts loaded, initializing map...");
          initMap();
        }, 500); // Increased delay for better reliability
      } catch (err) {
        console.error("Error loading HERE Maps:", err);
        setError(
          "Failed to load map resources: " + (err.message || "Unknown error")
        );
      }
    };

    loadMapScripts();
  }, []); // Empty dependency array means this runs once on mount

  // Initialize map with enhanced options
  const initMap = () => {
    if (!mapRef.current) {
      console.error("Map container reference not available");
      setError("Map container not found");
      return;
    }

    if (!window.H) {
      console.error("HERE Maps API not loaded");
      setError("Maps API not loaded correctly");
      return;
    }

    if (!API_KEY) {
      console.error("HERE Maps API key is missing");
      setError(
        "Maps API key not found. Check your environment variables or config.js"
      );
      return;
    }

    try {
      // Log API key safely
      console.log(
        "Initializing map with API key:",
        typeof API_KEY === "string"
          ? `${API_KEY.substring(0, 3)}...`
          : "invalid type"
      );

      // Initialize the platform object
      const platform = new window.H.service.Platform({
        apikey: API_KEY,
      });

      if (!platform) {
        throw new Error("Failed to initialize platform");
      }

      console.log("Platform initialized, creating default layers");
      // Get default layers
      const defaultLayers = platform.createDefaultLayers();

      if (
        !defaultLayers ||
        !defaultLayers.vector ||
        !defaultLayers.vector.normal ||
        !defaultLayers.vector.normal.map
      ) {
        throw new Error("Failed to create default layers");
      }

      console.log("Default layers created, initializing map");

      // Simplified map options
      const mapOptions = {
        center: center
          ? { lat: center.lat, lng: center.lng }
          : ANDHERI_COORDINATES,
        zoom: zoom,
        pixelRatio: window.devicePixelRatio || 1,
      };

      console.log("Map options:", JSON.stringify(mapOptions));

      // Initialize the map
      const map = new window.H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        mapOptions
      );

      console.log("Map initialized successfully");

      // Add map components with error handling
      let behavior;
      let ui;

      try {
        // Add map behavior
        const mapEvents = new window.H.mapevents.MapEvents(map);
        behavior = new window.H.mapevents.Behavior(mapEvents);
        console.log("Map behavior added successfully");
      } catch (behaviorError) {
        console.error("Error adding map behavior:", behaviorError);
      }

      try {
        // Add UI
        ui = window.H.ui.UI.createDefault(map, defaultLayers);
        console.log("Map UI created successfully");

        // Add custom geolocation button
        try {
          const locationButton = new window.H.ui.Control("custom-location", {
            position: "bottom-right",
            alignment: "right",
          });

          const locationButtonElement = document.createElement("div");
          locationButtonElement.className = styles.locationButton;
          locationButtonElement.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#1976d2" stroke-width="2" fill="none">
              <circle cx="12" cy="12" r="8"></circle>
              <line x1="12" y1="2" x2="12" y2="4"></line>
              <line x1="12" y1="20" x2="12" y2="22"></line>
              <line x1="20" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="12" x2="4" y2="12"></line>
            </svg>
          `;

          locationButtonElement.addEventListener("click", () => {
            if (navigator.geolocation) {
              locationButtonElement.classList.add(styles.locating);
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  map.setCenter({ lat: latitude, lng: longitude });
                  map.setZoom(16);
                  setTimeout(() => {
                    locationButtonElement.classList.remove(styles.locating);
                  }, 1000);
                },
                (error) => {
                  console.error("Error getting location:", error);
                  locationButtonElement.classList.remove(styles.locating);
                },
                { enableHighAccuracy: true, timeout: 10000 }
              );
            }
          });

          locationButton.setAlignment("right");
          locationButton.addChild(locationButtonElement);
          ui.addControl("custom-location", locationButton);
          console.log("Location control added successfully");
        } catch (controlError) {
          console.error("Error adding location control:", controlError);
        }
      } catch (uiError) {
        console.error("Error creating UI:", uiError);
        // Try a more basic UI approach
        try {
          ui = new window.H.ui.UI(map);
          console.log("Basic UI created as fallback");
        } catch (fallbackUiError) {
          console.error("Failed to create fallback UI:", fallbackUiError);
        }
      }

      // Add resize listener
      const handleResize = () => map.getViewPort().resize();
      window.addEventListener("resize", handleResize);

      // Create map object that will be stored in state
      const mapObj = { map, platform, ui, behavior };
      setMapObject(mapObj);
      setMapLoaded(true);

      // Add markers if available
      if (markers && markers.length) {
        addMarkers(mapObj, markers);
      }

      // Return cleanup function
      return () => {
        console.log("Cleaning up map");
        window.removeEventListener("resize", handleResize);
        try {
          map.dispose();
        } catch (disposeError) {
          console.error("Error disposing map:", disposeError);
        }
      };
    } catch (err) {
      console.error("Error initializing HERE Maps:", err);
      setError(`Failed to initialize map: ${err.message || "Unknown error"}`);
    }
  };
  // Add markers to the map
  const addMarkers = (mapObj, markersData) => {
    if (!mapObj || !markersData.length) return [];

    const { map } = mapObj;
    // Remove old markers before adding new ones
    map.getObjects().forEach((obj) => {
      if (
        obj instanceof window.H.map.DomMarker ||
        obj instanceof window.H.map.Marker
      ) {
        map.removeObject(obj);
      }
    });

    console.log(`Adding ${markersData.length} markers to the map`);
    console.log("Marker data received:", markersData);

    try {
      const { map, ui } = mapObj;
      const mapMarkers = [];
      const markerGroup = new window.H.map.Group();

      // Process each marker
      markersData.forEach((marker, index) => {
        try {
          const { lat, lng, title, isCurrentLocation, type, size } = marker;
          console.log(`Processing marker ${index}:`, {
            lat,
            lng,
            title,
            type,
            size,
          });

          if (!lat || !lng) {
            console.warn(`Marker ${index} is missing coordinates, skipping`);
            return;
          }

          let mapMarker;

          // Create marker based on type and size
          if (isCurrentLocation || type === "origin") {
            try {
              // Custom large marker for origin/current location
              const isLarge = size === "large";
              const currentLocIcon = new window.H.map.DomIcon(
                `<div class="${styles.currentLocationMarker}" ${
                  isLarge ? 'style="transform: scale(1.5); z-index: 1000;"' : ""
                }>
                   <div class="${styles.markerPulse}"></div>
                   <div class="${styles.markerCenter}"></div>
                 </div>`,
                { size: isLarge ? { w: 90, h: 90 } : { w: 60, h: 60 } }
              );
              mapMarker = new window.H.map.DomMarker(
                { lat, lng },
                { icon: currentLocIcon }
              );
              console.log(
                `✅ Created ${isLarge ? "LARGE" : "normal"} origin marker at:`,
                { lat, lng }
              );
            } catch (iconError) {
              console.error(
                "Error creating DOM marker, using standard marker:",
                iconError
              );
              mapMarker = new window.H.map.Marker({ lat, lng });
            }
          } else if (type === "destination") {
            try {
              // Custom large marker for destination
              const isLarge = size === "large";
              const destIcon = new window.H.map.DomIcon(
                `<div class="${styles.destinationMarker}" ${
                  isLarge
                    ? 'style="transform: translate(-50%, -100%) scale(1.5); z-index: 1000;"'
                    : ""
                }>
                   <div class="${styles.markerFlag}"></div>
                 </div>`,
                { size: isLarge ? { w: 75, h: 98 } : { w: 50, h: 65 } }
              );
              mapMarker = new window.H.map.DomMarker(
                { lat, lng },
                { icon: destIcon }
              );
              console.log(
                `✅ Created ${
                  isLarge ? "LARGE" : "normal"
                } destination marker at:`,
                { lat, lng }
              );
            } catch (iconError) {
              console.error(
                "Error creating destination marker, using standard marker:",
                iconError
              );
              mapMarker = new window.H.map.Marker({ lat, lng });
            }
          } else {
            // Standard marker
            const isLarge = size === "large";
            if (isLarge) {
              // Create a large standard marker
              try {
                const largeIcon = new window.H.map.DomIcon(
                  `<div style="width: 40px; height: 40px; background-color: #ff4444; border: 4px solid white; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transform: translate(-50%, -50%);"></div>`,
                  { size: { w: 48, h: 48 } }
                );
                mapMarker = new window.H.map.DomMarker(
                  { lat, lng },
                  { icon: largeIcon }
                );
                console.log(`✅ Created LARGE standard marker at:`, {
                  lat,
                  lng,
                });
              } catch (iconError) {
                console.error(
                  "Error creating large standard marker:",
                  iconError
                );
                mapMarker = new window.H.map.Marker({ lat, lng });
              }
            } else {
              mapMarker = new window.H.map.Marker({ lat, lng });
            }
          }

          // Add data and event listeners to markers
          if (mapMarker && title) {
            try {
              mapMarker.setData({
                title: title,
                description: isCurrentLocation
                  ? "Your current location"
                  : "Saved location",
              });

              // Add tap event for infowindow if UI is available
              if (ui) {
                mapMarker.addEventListener("tap", (evt) => {
                  try {
                    const data = evt.target.getData();
                    const bubble = new window.H.ui.InfoBubble(
                      evt.target.getGeometry(),
                      {
                        content: `
                        <div class="${styles.infoWindow}">
                          <div class="${styles.infoHeader}">${data.title}</div>
                          <div class="${styles.infoDescription}">${
                          data.description
                        }</div>
                          ${
                            isCurrentLocation
                              ? `<div class="${styles.infoLocationDetails}">
                              <span>Lat: ${lat.toFixed(4)}</span>
                              <span>Lng: ${lng.toFixed(4)}</span>
                            </div>`
                              : ""
                          }
                        </div>
                      `,
                      }
                    );

                    // Close any existing bubbles
                    if (typeof ui.getBubbles === "function") {
                      ui.getBubbles().forEach((b) => ui.removeBubble(b));
                    }

                    ui.addBubble(bubble);
                  } catch (bubbleError) {
                    console.error("Error creating info bubble:", bubbleError);
                  }
                });
              }
            } catch (dataError) {
              console.error("Error setting marker data:", dataError);
            }
          }

          // Add marker to the group
          markerGroup.addObject(mapMarker);
          mapMarkers.push(mapMarker);
        } catch (markerError) {
          console.error(`Error processing marker ${index}:`, markerError);
        }
      });

      // Add marker group to map and adjust viewport
      if (markerGroup.getObjects().length > 0) {
        map.addObject(markerGroup);
        console.log(`Added ${markerGroup.getObjects().length} markers to map`);

        // Adjust viewport for multiple markers
        if (mapMarkers.length > 1) {
          try {
            map.getViewModel().setLookAtData(
              {
                bounds: markerGroup.getBoundingBox(),
              },
              true
            );
            console.log("Adjusted viewport to show all markers");
          } catch (viewportError) {
            console.error("Error adjusting viewport:", viewportError);
          }
        }
      }

      return mapMarkers;
    } catch (error) {
      console.error("Error adding markers:", error);
      return [];
    }
  };
  // Helper function to create enhanced info bubble for safest route
  const createSafestRouteInfoBubble = (map, routeInfo) => {
    try {
      // Create DOM element for the safest route bubble
      const bubbleElement = document.createElement("div");
      bubbleElement.className = styles.safestRouteInfoBubble;

      bubbleElement.innerHTML = `
        <div class="${styles.safestRouteInfoContent}">
          <div class="${styles.safestRouteType}">🛡️ SAFEST ROUTE</div>
          <div class="${styles.safestRouteStats}">
            <span class="${styles.safestRouteBadge}">${routeInfo.safetyScore}% Safe</span>
            <span>•</span>
            <span>${routeInfo.distance}</span>
            <span>•</span>
            <span>${routeInfo.duration}</span>
          </div>
        </div>
      `;

      // Create DOM marker with the bubble content
      const marker = new window.H.map.DomMarker(routeInfo.position, {
        icon: new window.H.map.DomIcon(bubbleElement),
      });

      map.addObject(marker);
      return marker;
    } catch (error) {
      console.error("Error creating safest route info bubble:", error);
      return null;
    }
  };
  // Process routing
  const processRoutes = async (mapObj, routesData) => {
    if (!mapObj || !routesData.length) {
      console.log("🗺️ HereMap processRoutes: No mapObj or routes data");
      return;
    }

    console.log(
      `🛣️ HereMap processRoutes: Processing ${routesData.length} routes`,
      routesData
    );
    const { map, platform } = mapObj;

    try {
      // Clear existing routes
      map.getObjects().forEach((obj) => {
        if (obj instanceof window.H.map.Polyline) {
          map.removeObject(obj);
        }
      });

      // Get routing service
      const router = platform.getRoutingService(null, 8);

      // Process each route
      routesData.forEach((route, index) => {
        if (route.points && route.points.length >= 2) {
          try {
            // Format waypoints
            const waypoints = route.points.map(
              (point) => `${point.lat},${point.lng}`
            );

            // Create routing parameters
            const routeParams = {
              routingMode: "fast",
              transportMode: "car",
              origin: waypoints[0],
              destination: waypoints[waypoints.length - 1],
              return: "polyline,summary",
            };

            // Add via points if there are any
            if (waypoints.length > 2) {
              routeParams.via = waypoints.slice(1, -1).join(";");
            }

            // Calculate route
            router.calculateRoute(
              routeParams,
              (result) => {
                if (result.routes && result.routes.length) {
                  try {
                    const routeData = result.routes[0];
                    const lineString = new window.H.geo.LineString();

                    // Process route shape
                    routeData.sections.forEach((section) => {
                      if (section.polyline) {
                        section.polyline.forEach((point) => {
                          lineString.pushPoint({
                            lat: point.lat,
                            lng: point.lng,
                          });
                        });
                      }
                    }); // Create polyline with enhanced styling
                    const routeStyle = {
                      lineWidth: route.lineWidth || 6,
                      strokeColor: route.color || "#4CAF50",
                      lineJoin: "round",
                      lineCap: "round",
                      strokeDashArray: route.strokeDashArray || null,
                      opacity: route.opacity || 1.0,
                    }; // Enhanced styling for safest route
                    if (route.isSafest) {
                      routeStyle.lineWidth = Math.max(routeStyle.lineWidth, 12);
                      routeStyle.strokeColor = route.color || "#2E7D32";
                      routeStyle.opacity = 1.0;
                      routeStyle.strokeDashArray = null; // Always solid for safest route
                      // Add shadow effect for safest route
                      routeStyle.lineCap = "round";
                      routeStyle.lineJoin = "round";

                      // Create shadow route first for glow effect
                      if (route.glowEffect) {
                        const shadowStyle = {
                          ...routeStyle,
                          lineWidth: routeStyle.lineWidth + 6,
                          strokeColor:
                            route.shadowColor || "rgba(76, 175, 80, 0.4)",
                          opacity: 0.6,
                        };
                        const shadowLine = new window.H.map.Polyline(
                          lineString,
                          {
                            style: shadowStyle,
                            zIndex: (route.isSafest ? 100 : 50 - index) - 1,
                          }
                        );
                        map.addObject(shadowLine);
                      }
                    }

                    const routeLine = new window.H.map.Polyline(lineString, {
                      style: routeStyle,
                      // Add z-index to make safest route appear on top
                      zIndex: route.isSafest ? 100 : 50 - index,
                    }); // Add to map
                    map.addObject(routeLine);

                    // Add special info bubble for safest route
                    if (route.isSafest) {
                      try {
                        const midPoint = lineString.extractPoint(
                          Math.floor(lineString.getPointCount() / 2)
                        );
                        const safestRouteInfoBubble =
                          createSafestRouteInfoBubble(map, {
                            position: midPoint,
                            distance: route.distance || "N/A",
                            duration: route.duration || "N/A",
                            safetyScore: route.safetyScore || 85,
                          });
                      } catch (bubbleError) {
                        console.error(
                          "Error creating safest route info bubble:",
                          bubbleError
                        );
                      }
                    }

                    // Adjust viewport if needed
                    try {
                      map.getViewModel().setLookAtData({
                        bounds: routeLine.getBoundingBox(),
                      });
                    } catch (viewError) {
                      console.error(
                        "Error adjusting view for route:",
                        viewError
                      );
                    }
                  } catch (routeRenderError) {
                    console.error(
                      `Error rendering route ${index}:`,
                      routeRenderError
                    );
                  }
                } else {
                  console.warn(`No routes found for route ${index}`);
                }
              },
              (error) => {
                console.error(`Routing error for route ${index}:`, error);
              }
            );
          } catch (routeProcessError) {
            console.error(
              `Error processing route ${index}:`,
              routeProcessError
            );
          }
        } else {
          console.warn(`Route ${index} has insufficient points`);
        }
      });
    } catch (routesError) {
      console.error("Error processing routes:", routesError);
    }
  };

  // Handle layer switching
  const switchMapLayer = (layerType) => {
    if (!mapLoaded || !mapObject || !mapObject.map) return;

    try {
      console.log(`Switching map layer to ${layerType}`);
      const { map, platform } = mapObject;
      const defaultLayers = platform.createDefaultLayers();

      // Remove current base layers
      map.getLayers().forEach((layer) => {
        try {
          const provider = layer.getProvider();
          if (
            provider &&
            (provider.providerType === "imagery" ||
              provider.providerType === "map")
          ) {
            map.removeLayer(layer);
          }
        } catch (layerError) {
          console.error("Error removing layer:", layerError);
        }
      });

      // Add new base layer
      try {
        switch (layerType) {
          case "satellite":
            map.addLayer(defaultLayers.raster.satellite.map);
            break;
          case "terrain":
            map.addLayer(defaultLayers.vector.normal.terrain);
            break;
          default:
            map.addLayer(defaultLayers.vector.normal.map);
        }
        setActiveLayer(layerType);
      } catch (addLayerError) {
        console.error("Error adding new layer:", addLayerError);
        // Try to restore normal map if adding new layer fails
        try {
          map.addLayer(defaultLayers.vector.normal.map);
          setActiveLayer("normal");
        } catch (fallbackError) {
          console.error("Error adding fallback layer:", fallbackError);
        }
      }
    } catch (error) {
      console.error("Error switching map layer:", error);
    }
  };

  // Update markers when props change
  useEffect(() => {
    if (mapLoaded && mapObject && mapObject.map && markers.length) {
      try {
        // Clear existing markers
        const objects = mapObject.map.getObjects();
        objects.forEach((obj) => {
          if (
            obj instanceof window.H.map.Marker ||
            obj instanceof window.H.map.DomMarker
          ) {
            mapObject.map.removeObject(obj);
          }
        });

        // Add new markers
        addMarkers(mapObject, markers);
      } catch (error) {
        console.error("Error updating markers:", error);
      }
    }
  }, [markers, mapLoaded, mapObject]);

  // Update center when props change
  useEffect(() => {
    if (mapLoaded && mapObject && mapObject.map && center) {
      try {
        mapObject.map.setCenter({ lat: center.lat, lng: center.lng }, true);
        mapObject.map.setZoom(zoom, true);
      } catch (error) {
        console.error("Error updating map center:", error);
      }
    }
  }, [center, zoom, mapLoaded, mapObject]);

  // Update routes when props change
  useEffect(() => {
    if (mapLoaded && mapObject && mapObject.map && routes.length > 0) {
      processRoutes(mapObject, routes);
    }
  }, [routes, mapLoaded, mapObject]);

  // Handle traffic layer
  useEffect(() => {
    if (!mapLoaded || !mapObject || !mapObject.map || !mapObject.platform)
      return;

    try {
      const { map, platform } = mapObject;
      const defaultLayers = platform.createDefaultLayers();

      // Remove existing traffic layer if any
      map.getLayers().forEach((layer) => {
        if (layer.getId && layer.getId() === "traffic") {
          map.removeLayer(layer);
        }
      });

      // Add traffic layer if requested
      if (showTraffic) {
        try {
          const trafficLayer = defaultLayers.vector.normal.traffic;
          if (trafficLayer) {
            trafficLayer.setId("traffic");
            map.addLayer(trafficLayer);
            console.log("Traffic layer added");
          } else {
            console.warn("Traffic layer not available in default layers");
          }
        } catch (trafficError) {
          console.error("Error adding traffic layer:", trafficError);
        }
      }
    } catch (error) {
      console.error("Error handling traffic layer:", error);
    }
  }, [showTraffic, mapLoaded, mapObject]);

  return (
    <div className={styles.mapWrapper}>
      {error ? (
        <div className={styles.mapError}>
          <p>{error}</p>
        </div>
      ) : !mapLoaded && !window.H ? (
        <div className={styles.mapLoading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading map...</p>
        </div>
      ) : null}

      <div
        ref={mapRef}
        className={styles.mapContainer}
        style={{
          visibility: error ? "hidden" : "visible",
        }}
      />

      {/* Map controls overlay */}
      {mapLoaded && (
        <>
          <div className={styles.mapControls}>
            <button
              className={`${styles.mapLayerButton} ${
                activeLayer === "normal" ? styles.active : ""
              }`}
              onClick={() => switchMapLayer("normal")}
              title="Standard map view"
            >
              <FaLayerGroup /> <span>Map</span>
            </button>
            <button
              className={`${styles.mapLayerButton} ${
                activeLayer === "satellite" ? styles.active : ""
              }`}
              onClick={() => switchMapLayer("satellite")}
              title="Satellite imagery"
            >
              <FaLayerGroup /> <span>Satellite</span>
            </button>
            <button
              className={`${styles.mapLayerButton} ${
                activeLayer === "terrain" ? styles.active : ""
              }`}
              onClick={() => switchMapLayer("terrain")}
              title="Terrain view"
            >
              <FaLayerGroup /> <span>Terrain</span>
            </button>
          </div>

          <div className={styles.mapAttribution}>
            Map data &copy; HERE {new Date().getFullYear()}
          </div>
        </>
      )}
    </div>
  );
};

export default HereMap;

import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Safety from "./pages/Safety";
import MapPage from "./pages/MapPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EmergencyAlert from "./pages/EmergencyAlert";
import EmailTest from "./pages/EmailTest";
import EmailDebug from "./pages/EmailDebug";
import ShareLocationDebug from "./components/safety/ShareLocationDebug";
import SafeRoutes from "./pages/SafeRoutes";
import NotFound from "./pages/NotFound";
import { AuthContext } from "./context/AuthContext";
import PrivateRoute from "./components/routing/PrivateRoute";
import MapErrorBoundary from "./components/map/MapErrorBoundary";
import HereMap from "./components/map/HereMap";

// Create a separate component that uses AuthContext
function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext);

  // Default map state
  const [userPosition, setUserPosition] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [mapRoutes, setMapRoutes] = useState([]);
  const [displayTraffic, setDisplayTraffic] = useState(false);

  // Get user's location when app loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition({ lat: latitude, lng: longitude });

          // Create a marker for the user's current location
          setMapMarkers([
            {
              lat: latitude,
              lng: longitude,
              title: "Your Location",
              isCurrentLocation: true,
            },
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);
  return (
    <div className="App">
      <main className="container">
        {" "}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />{" "}
          <Route
            path="/emergency-alert"
            element={
              <PrivateRoute>
                <EmergencyAlert />
              </PrivateRoute>
            }
          />{" "}
          <Route path="/email-test" element={<EmailTest />} />
          <Route path="/email-debug" element={<EmailDebug />} />
          <Route
            path="/share-location-debug"
            element={<ShareLocationDebug />}
          />
          <Route
            path="/safe-routes"
            element={
              <PrivateRoute>
                <SafeRoutes />
              </PrivateRoute>
            }
          />
          <Route
            path="/safety"
            element={
              <PrivateRoute>
                <Safety />
              </PrivateRoute>
            }
          />
          <Route
            path="/map"
            element={
              <MapErrorBoundary>
                <HereMap
                  center={userPosition}
                  zoom={14}
                  markers={mapMarkers}
                  routes={mapRoutes}
                  showTraffic={displayTraffic}
                />
              </MapErrorBoundary>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

// Main App component that doesn't use AuthContext directly
function App() {
  return <AppRoutes />;
}

export default App;

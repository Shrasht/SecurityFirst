import React, { useState } from 'react';
import { 
  GoogleMap, 
  useJsApiLoader, 
  Marker, 
  DirectionsRenderer, 
  HeatmapLayer,
  InfoWindow 
} from '@react-google-maps/api';
import styles from './Map.module.css';
import { 
  FaShieldAlt, 
  FaHospital, 
  FaHome, 
  FaPrescriptionBottleAlt, 
  FaLightbulb 
} from 'react-icons/fa';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// We would use a real API key in production
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE'; 

const libraries = ['places', 'visualization'];

const Map = ({ center, zoom = 14, markers = [], routes = [], heatmapData = [], helpPoints = [] }) => {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  // If a route is provided, display it
  React.useEffect(() => {
    if (routes.length > 0 && isLoaded && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      
      // Use the first route for now
      const route = routes[0];
      
      // Convert route points to DirectionsService waypoints
      if (route.points && route.points.length >= 2) {
        const origin = route.points[0];
        const destination = route.points[route.points.length - 1];
        const waypoints = route.points.slice(1, -1).map(point => ({
          location: new window.google.maps.LatLng(point.lat, point.lng),
          stopover: false
        }));
        
        directionsService.route({
          origin: new window.google.maps.LatLng(origin.lat, origin.lng),
          destination: new window.google.maps.LatLng(destination.lat, destination.lng),
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.WALKING
        }, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Directions request failed: ${status}`);
          }
        });
      }
    }
  }, [routes, isLoaded]);

  // Get marker icon based on help point type
  const getMarkerIcon = (type) => {
    switch(type) {
      case 'police':
        return {
          path: 'M10,0C4.5,0,0,4.5,0,10s4.5,10,10,10s10-4.5,10-10S15.5,0,10,0z M15,16H5v-2h10V16z M16,9H4V7h12V9z M15,4H5V2h10V4z',
          fillColor: '#1565C0',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 1.5,
          anchor: new window.google.maps.Point(10, 10)
        };
      case 'hospital':
        return {
          path: 'M10,0C4.5,0,0,4.5,0,10s4.5,10,10,10s10-4.5,10-10S15.5,0,10,0z M15,11h-4v4H9v-4H5V9h4V5h2v4h4V11z',
          fillColor: '#E53935',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 1.5,
          anchor: new window.google.maps.Point(10, 10)
        };
      case 'shelter':
        return {
          path: 'M10,1.5l8.5,7H16v9h-5v-6H9v6H4v-9H1.5L10,1.5z',
          fillColor: '#43A047',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 1.5,
          anchor: new window.google.maps.Point(10, 10)
        };
      case 'pharmacy':
        return {
          path: 'M6,3h12v2H6V3z M17,6H7C5.9,6,5,6.9,5,8v11c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V8C19,6.9,18.1,6,17,6z M13,17h-2v-2h2V17z M13,13h-2v-2h2V13z M13,9h-2V7h2V9z',
          fillColor: '#00ACC1',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 1.3,
          anchor: new window.google.maps.Point(12, 12)
        };
      case 'lit-area':
        return {
          path: 'M12,3c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S17,3,12,3z M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18z M12,8v6l5.2,3.1l0.8-1.2l-4.5-2.7V8H12z',
          fillColor: '#FFC107',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 1.2,
          anchor: new window.google.maps.Point(12, 12)
        };
      default:
        return {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 8
        };
    }
  };

  // Render help point info window content
  const renderInfoWindowContent = (point) => {
    let icon;
    switch(point.type) {
      case 'police': icon = <FaShieldAlt className={styles.infoIcon} style={{color: '#1565C0'}} />; break;
      case 'hospital': icon = <FaHospital className={styles.infoIcon} style={{color: '#E53935'}} />; break;
      case 'shelter': icon = <FaHome className={styles.infoIcon} style={{color: '#43A047'}} />; break;
      case 'pharmacy': icon = <FaPrescriptionBottleAlt className={styles.infoIcon} style={{color: '#00ACC1'}} />; break;
      case 'lit-area': icon = <FaLightbulb className={styles.infoIcon} style={{color: '#FFC107'}} />; break;
      default: icon = <FaShieldAlt className={styles.infoIcon} />;
    }

    return (
      <div className={styles.infoWindow}>
        <div className={styles.infoHeader}>
          {icon} <span>{point.name}</span>
        </div>
        <div className={styles.infoDistance}>{point.distance} away</div>
        <div className={styles.infoActions}>
          <button className={styles.infoButton}>Get Directions</button>
          <button className={styles.infoButton}>Details</button>
        </div>
      </div>
    );
  };

  if (loadError) {
    return <div className={styles.mapError}>Map cannot be loaded right now, sorry.</div>;
  }

  if (!isLoaded) {
    return <div className={styles.mapLoading}>Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {/* Current location marker */}
      <Marker
        position={center}
        icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 8
        }}
      />
      
      {/* Additional markers */}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.title}
          icon={marker.icon}
        />
      ))}
      
      {/* Help points */}
      {helpPoints.map((point) => (
        <Marker
          key={point.id}
          position={{ lat: point.lat, lng: point.lng }}
          title={point.name}
          icon={getMarkerIcon(point.type)}
          onClick={() => setSelectedPoint(point)}
        />
      ))}
      
      {/* Info window for selected help point */}
      {selectedPoint && (
        <InfoWindow
          position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
          onCloseClick={() => setSelectedPoint(null)}
        >
          <div>
            {renderInfoWindowContent(selectedPoint)}
          </div>
        </InfoWindow>
      )}
      
      {/* Safety heatmap layer */}
      {heatmapData.length > 0 && (
        <HeatmapLayer
          data={heatmapData}
          options={{
            radius: 20,
            opacity: 0.7,
            gradient: [
              'rgba(0, 255, 0, 0)',
              'rgba(0, 255, 0, 1)',
              'rgba(255, 255, 0, 1)',
              'rgba(255, 140, 0, 1)',
              'rgba(255, 0, 0, 1)'
            ]
          }}
        />
      )}
      
      {/* Route directions */}
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: routes[0]?.color || '#4285F4',
              strokeWeight: 5,
              strokeOpacity: 0.8
            },
            suppressMarkers: true
          }}
        />
      )}
    </GoogleMap>
  );
};

export default React.memo(Map);

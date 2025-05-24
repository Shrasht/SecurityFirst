import React, { useState, useEffect, useRef } from "react";
import styles from "./Map.module.css";
import { FaSearch, FaLocationArrow, FaTimes, FaHistory } from "react-icons/fa";
import { HERE_MAPS_API_KEY } from "../../config";

// Location search component for addresses and coordinates
const LocationSearch = ({
  onSelectLocation,
  placeholder,
  defaultValue = "",
  recentLocations = [],
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    // Set up click handler to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowResults(false);
        setShowRecent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const searchLocation = async (text) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);

      // Check if it's coordinates first (basic regex for lat,lng format)
      const coordMatch = text.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
      if (coordMatch) {
        const result = {
          title: "Custom Location",
          position: {
            lat: parseFloat(coordMatch[1]),
            lng: parseFloat(coordMatch[3]),
          },
          address: `${coordMatch[1]}, ${coordMatch[3]}`,
        };
        setResults([result]);
        setIsLoading(false);
        return;
      }

      // Otherwise use HERE Geocoder API
      if (!window.H) {
        console.error("HERE Maps API not loaded");
        setIsLoading(false);
        return;
      }

      const platform = new window.H.service.Platform({
        apikey: HERE_MAPS_API_KEY,
      });

      const geocoder = platform.getSearchService();

      geocoder.geocode(
        {
          q: text,
          limit: 5,
        },
        (results) => {
          if (results && results.items) {
            const formattedResults = results.items.map((item) => ({
              title: item.title,
              position: {
                lat: item.position.lat,
                lng: item.position.lng,
              },
              address: item.address.label,
            }));

            setResults(formattedResults);
            setShowResults(formattedResults.length > 0);
          } else {
            setResults([]);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Geocoding error:", error);
          setResults([]);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error searching location:", error);
      setResults([]);
      setIsLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocation(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result) => {
    setQuery(result.address);
    onSelectLocation(result);
    setShowResults(false);
  };

  const handleRecentSelect = (location) => {
    setQuery(location);
    setShowRecent(false);
    searchLocation(location);
  };

  const clearInput = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className={styles.locationSearchContainer}>
      <div className={styles.searchInputWrapper} ref={inputRef}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "Search for a location"}
          className={styles.locationSearchInput}
          onFocus={() => {
            if (recentLocations.length > 0 && !query) {
              setShowRecent(true);
            }
          }}
        />
        {isLoading ? (
          <div className={styles.loaderSmall}></div>
        ) : query ? (
          <FaTimes className={styles.clearIcon} onClick={clearInput} />
        ) : null}
      </div>

      {showResults && results.length > 0 && (
        <div className={styles.resultsDropdown} ref={resultsRef}>
          {results.map((result, index) => (
            <div
              key={index}
              className={styles.resultItem}
              onClick={() => handleSelect(result)}
            >
              <div className={styles.resultItemTitle}>{result.title}</div>
              <div className={styles.resultItemAddress}>{result.address}</div>
            </div>
          ))}
        </div>
      )}

      {showRecent && recentLocations.length > 0 && (
        <div className={styles.resultsDropdown} ref={resultsRef}>
          <div className={styles.recentHeader}>
            <FaHistory /> Recent Searches
          </div>
          {recentLocations.map((location, index) => (
            <div
              key={index}
              className={styles.resultItem}
              onClick={() => handleRecentSelect(location)}
            >
              <FaHistory className={styles.recentIcon} />
              {location}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;

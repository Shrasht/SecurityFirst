import React, { Component } from "react";
import styles from "./Map.module.css";

class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Map Error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when the map encounters an error
      return (
        <div className={styles.mapError}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Map Error</h3>
          <p>We're sorry, but there was a problem loading the map.</p>
          <p className={styles.errorDetails}>
            {this.state.error && this.state.error.toString()}
          </p>
          <button
            className={styles.retryButton}
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;

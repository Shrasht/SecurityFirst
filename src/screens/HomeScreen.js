import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  Text,
  Card,
  Button,
  Title,
  Paragraph,
  Switch,
  Badge,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import LocationService from "../services/LocationService";
import WeatherService from "../services/WeatherService";
import BatteryService from "../services/BatteryService";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [weatherData, setWeatherData] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isBatterySaverOn, setIsBatterySaverOn] = useState(false);
  const [isLocationSharing, setIsLocationSharing] = useState(false);

  useEffect(() => {
    // Get current weather
    WeatherService.getCurrentWeather()
      .then((data) => setWeatherData(data))
      .catch((err) => console.error("Error fetching weather:", err));

    // Get battery level
    BatteryService.getBatteryLevel()
      .then((level) => setBatteryLevel(level))
      .catch((err) => console.error("Error getting battery level:", err));

    // Start location tracking
    const unsubscribe = LocationService.startTracking();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const toggleBatterySaver = () => {
    const newState = !isBatterySaverOn;
    setIsBatterySaverOn(newState);
    BatteryService.setBatterySaverMode(newState);
  };

  const toggleLocationSharing = () => {
    const newState = !isLocationSharing;
    setIsLocationSharing(newState);
    LocationService.toggleLocationSharing(newState);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>SafeGuard</Title>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Icon name="cog" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Status Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Status</Title>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Icon
                name="battery"
                size={24}
                color={batteryLevel > 20 ? "green" : "red"}
              />
              <Text>{batteryLevel}%</Text>
            </View>
            {weatherData && (
              <View style={styles.statusItem}>
                <Icon name="weather-partly-cloudy" size={24} color="#4A90E2" />
                <Text>{weatherData.temperature}°</Text>
              </View>
            )}
            <View style={styles.statusItem}>
              <Icon name="wifi" size={24} color="green" />
              <Text>Connected</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Emergency Contacts Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.rowBetween}>
            <Title>Emergency Contacts</Title>
            <Badge>3</Badge>
          </View>
          <View style={styles.contactList}>
            <View style={styles.contact}>
              <Icon name="account" size={20} color="#333" />
              <Text style={styles.contactText}>Mom</Text>
              <Icon name="phone" size={20} color="green" />
            </View>
            <View style={styles.contact}>
              <Icon name="account" size={20} color="#333" />
              <Text style={styles.contactText}>Dad</Text>
              <Icon name="phone" size={20} color="green" />
            </View>
            <View style={styles.contact}>
              <Icon name="account" size={20} color="#333" />
              <Text style={styles.contactText}>Friend</Text>
              <Icon name="phone" size={20} color="green" />
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button>Edit Contacts</Button>
        </Card.Actions>
      </Card>

      {/* Quick Actions Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("SavedPlaces")}
            >
              <Icon name="star" size={24} color="#FF9800" />
              <Text style={styles.actionText}>Saved Places</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("RouteHistory")}
            >
              <Icon name="history" size={24} color="#4CAF50" />
              <Text style={styles.actionText}>Route History</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Settings Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Settings</Title>
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Battery Saver Mode</Text>
              <Text style={styles.settingSubTitle}>
                Reduces location update frequency
              </Text>
            </View>
            <Switch
              value={isBatterySaverOn}
              onValueChange={toggleBatterySaver}
              color="#FF4081"
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Location Sharing</Text>
              <Text style={styles.settingSubTitle}>
                Share with emergency contacts
              </Text>
            </View>
            <Switch
              value={isLocationSharing}
              onValueChange={toggleLocationSharing}
              color="#FF4081"
            />
          </View>
        </Card.Content>
      </Card>

      {/* Emergency Button */}
      <View style={styles.emergencyContainer}>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => navigation.navigate("Emergency")}
        >
          <Text style={styles.emergencyText}>EMERGENCY</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4081",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  statusItem: {
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactList: {
    marginTop: 12,
  },
  contact: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contactText: {
    marginLeft: 10,
    flex: 1,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    width: "45%",
  },
  actionText: {
    marginTop: 5,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingSubTitle: {
    fontSize: 12,
    color: "gray",
  },
  emergencyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emergencyButton: {
    backgroundColor: "#FF4081",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emergencyText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default HomeScreen;

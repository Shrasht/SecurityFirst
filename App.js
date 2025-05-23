import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import MapScreen from "./src/screens/MapScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EmergencyScreen from "./src/screens/EmergencyScreen";
import SavedPlacesScreen from "./src/screens/SavedPlacesScreen";
import RouteHistoryScreen from "./src/screens/RouteHistoryScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "Profile") {
            iconName = "account";
          } else if (route.name === "Emergency") {
            iconName = "shield";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF4081",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{
          tabBarButton: (props) => <EmergencyTabButton {...props} />,
        }}
      />
    </Tab.Navigator>
  );
}

function EmergencyTabButton(props) {
  return (
    <TouchableOpacity
      {...props}
      style={{
        top: -10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: "#FF4081",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        <Icon name="shield" color="white" size={30} />
      </View>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SavedPlaces"
              component={SavedPlacesScreen}
              options={{ title: "Saved Places" }}
            />
            <Stack.Screen
              name="RouteHistory"
              component={RouteHistoryScreen}
              options={{ title: "Route History" }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: "Settings" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

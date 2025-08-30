import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import DoctorsScreen from "./Doctor";
import BookingsScreen from "./BookingList";
import ProfileScreen from "./Profile";

const Tab = createBottomTabNavigator();

/* ------------ Main Tabs ------------ */
export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#00C46B",
                tabBarInactiveTintColor: "gray",
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Doctors") iconName = "medkit";
                    else if (route.name === "Bookings") iconName = "calendar";
                    else if (route.name === "Profile") iconName = "person";
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Doctors" component={DoctorsScreen} />
            <Tab.Screen name="Bookings" component={BookingsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}



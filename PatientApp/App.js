import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Components/Home";
import AuthScreen from "./Components/Auth";
import MainTabs from "./Components/MainTabs";
import BookAppointmentScreen from "./Components/BookingAppointmentScreen"

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="BookAppointmentScreen" component={BookAppointmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

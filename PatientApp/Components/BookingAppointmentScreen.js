import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    FlatList,
} from "react-native";
import { getToken } from "../Utils/token"; // your token helper
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";

export default function BookAppointmentScreen({ route, navigation }) {
    const { doctor } = route.params;
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );


    // Generate 30-min slots between 9 AM and 5 PM
    const generateTimeSlots = () => {
        const slots = [];
        let start = new Date();
        start.setHours(9, 0, 0, 0);

        for (let i = 0; i < 16; i++) {
            let slot = new Date(start.getTime() + i * 30 * 60000);
            slots.push(
                slot.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            );
        }
        return slots;
    };
    const [selectedTime, setSelectedTime] = useState(generateTimeSlots()[0]);

    const timeSlots = generateTimeSlots();

    const convertTo24Hour = (time12h) => {
        // replace non-breaking spaces with normal space
        time12h = time12h.replace(/\u202F|\u00A0/g, " ");

        let [time, modifier] = time12h.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
        if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

        return { hours, minutes };
    };


    const handleBooking = async () => {
        // console.log("DEBUG: handleBooking fired 🚀");

        if (!selectedDate || !selectedTime) {
            Alert.alert("Select Date & Time", "Please choose a date and time slot");
            console.log("DEBUG: Missing selection", { selectedDate, selectedTime });
            return;
        }

        // console.log("DEBUG: Selected", { selectedDate, selectedTime });


        const token = await getToken();
        if (!token) {
            Alert.alert("Authentication Error", "Please login again");
            console.log("DEBUG: Missing token");
            return;
        }

        const { hours, minutes } = convertTo24Hour(selectedTime);

        // ✅ Build exact ISO string using dayjs
        const isoTime = dayjs(selectedDate)
            .hour(hours)
            .minute(minutes)
            .second(0)
            .millisecond(0)
            .toISOString();

        console.log("DEBUG: Final ISO Time =>", isoTime);

        try {
            const res = await fetch("https://clinixsphere-assignment.onrender.com/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    doctorId: doctor.user._id,
                    time: isoTime, // ✅ Direct ISO string
                }),
            });

            const data = await res.json();
            console.log("DEBUG: API response", data);

            if (res.ok) {
                Alert.alert("Success", "Appointment booked successfully!");
                navigation.navigate("MainTabs", { screen: "Bookings" });

            } else {
                Alert.alert("Error", data.message || "Failed to book appointment");
            }
        } catch (err) {
            console.log("DEBUG: Fetch error", err);
            Alert.alert("Error", "Could not connect to server");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Book Appointment with {doctor.user?.name}
            </Text>
            <Text style={styles.subtext}>Speciality: {doctor.speciality}</Text>

            {/* Calendar */}
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                    [selectedDate]: {
                        selected: true,
                        marked: true,
                        selectedColor: "#00C46B",
                    },
                }}
                theme={{
                    todayTextColor: "#00C46B",
                    selectedDayBackgroundColor: "#00C46B",
                }}
            />

            {/* Time Slots */}
            <Text style={styles.slotHeading}>Available Time Slots</Text>
            <FlatList
                data={timeSlots}
                numColumns={3}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.slotContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.slot,
                            selectedTime === item && styles.selectedSlot,
                        ]}
                        onPress={() => setSelectedTime(item)}
                    >
                        <Text
                            style={[
                                styles.slotText,
                                selectedTime === item && styles.selectedSlotText,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Book Button */}
            <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
                <Text style={styles.bookText}>Book Appointment</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff", marginTop: 25 },
    heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
    subtext: { fontSize: 16, marginBottom: 20 },
    slotHeading: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
    slotContainer: { marginTop: 10 },
    slot: {
        flex: 1,
        margin: 5,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
    },
    selectedSlot: {
        backgroundColor: "#00C46B",
        borderColor: "#00C46B",
    },
    slotText: { fontSize: 14, color: "#333" },
    selectedSlotText: { color: "#fff", fontWeight: "bold" },
    bookButton: {
        backgroundColor: "#00C46B",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    bookText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

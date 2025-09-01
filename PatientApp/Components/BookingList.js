import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { getToken } from "../Utils/token"; // your token helper

function BookingsScreen() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = await getToken();
                if (!token) {
                    console.error("No token found");
                    setLoading(false);
                    return;
                }

                const response = await fetch("https://clinixsphere-assignment.onrender.com/appointments/my-patient", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [bookings]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00C46B" />
            </View>
        );
    }

    // useFocusEffect(fetchBookings());

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>My Bookings</Text>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.doctorName}>{item.doctor?.name}</Text>
                        <Text style={styles.specialty}>
                            Date: {new Date(item.time).toLocaleDateString()} {"\n"}
                            Time: {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Text>
                        <Text style={{ color: item.status === "completed" ? "green" : "orange" }}>
                            Status: {item.status}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
                        No bookings found
                    </Text>
                }
            />
        </View>
    );
}

export default BookingsScreen;

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flex: 1,
        backgroundColor: "#f9fdfb",
        padding: 15,
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#00C46B",
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee",
    },
    doctorName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    specialty: {
        fontSize: 14,
        color: "#777",
    },
});

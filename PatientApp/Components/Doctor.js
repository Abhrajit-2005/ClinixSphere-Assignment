import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { getToken } from "../Utils/token";

export default function DoctorsScreen({ navigation }) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = await getToken();
                if (!token) {
                    Alert.alert("Error", "No token found. Please login again.");
                    return;
                }

                const url = "https://clinixsphere-assignment.onrender.com/patient/doctors";
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });


                const data = await res.json();
                // console.log(data);

                if (res.ok) {
                    setDoctors(data);
                } else {
                    Alert.alert("Error", data.message || "Failed to fetch doctors");
                }
            } catch (err) {
                console.error("Doctors fetch error:", err);
                Alert.alert("Error", "Could not fetch doctors");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00C46B" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Find a Doctor</Text>
            {doctors.length === 0 ? (
                <Text>No doctors available</Text>
            ) : (
                <FlatList
                    data={doctors}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate("BookAppointmentScreen", { doctor: item })}
                        >
                            <Text style={styles.doctorName}>{item.user?.name}</Text>
                            <Text style={styles.specialty}>{item.speciality}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#f9f9f9",
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
    },
    doctorName: {
        fontSize: 18,
        fontWeight: "600",
    },
    specialty: {
        fontSize: 16,
        color: "gray",
    },
});

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from "react-native";
import { getToken, removeToken } from "../Utils/token";

export default function ProfileScreen({ navigation }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: "", email: "" });

    // Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await getToken();
                const res = await fetch("https://clinixsphere-assignment.onrender.com/patient/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setProfile(data);
                    setForm({ name: data.name, email: data.email });
                } else {
                    Alert.alert("Error", data.message || "Failed to load profile");
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
                Alert.alert("Error", "Could not fetch profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Update profile
    const handleUpdate = async () => {
        try {
            const token = await getToken();
            const res = await fetch("https://clinixsphere-assignment.onrender.com/patient/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(data);
                setEditing(false);
                Alert.alert("Success", "Profile updated successfully");
            } else {
                Alert.alert("Error", data.message || "Failed to update profile");
            }
        } catch (err) {
            console.error("Profile update error:", err);
            Alert.alert("Error", "Could not update profile");
        }
    };

    // Logout
    const handleLogout = async () => {
        await removeToken();
        navigation.replace("Auth");
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00C46B" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>My Profile</Text>

            <View style={styles.card}>
                {editing ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={form.name}
                            onChangeText={(text) => setForm({ ...form, name: text })}
                            placeholder="Name"
                        />
                        <TextInput
                            style={styles.input}
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
                            placeholder="Email"
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setEditing(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.doctorName}>{profile?.name}</Text>
                        <Text style={styles.specialty}>{profile?.email}</Text>
                        <Text style={styles.role}>Role: {profile?.role}</Text>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setEditing(true)}
                        >
                            <Text style={styles.editText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

/* ------------ Styles ------------ */
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
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    specialty: {
        fontSize: 16,
        color: "#777",
        marginTop: 4,
    },
    role: {
        fontSize: 14,
        marginTop: 6,
        fontStyle: "italic",
        color: "#444",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    editButton: {
        marginTop: 15,
        backgroundColor: "#007BFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    editText: {
        color: "#fff",
        fontWeight: "600",
    },
    saveButton: {
        backgroundColor: "#00C46B",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    saveText: {
        color: "#fff",
        fontWeight: "600",
    },
    cancelButton: {
        backgroundColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    cancelText: {
        color: "#333",
    },
    logoutButton: {
        marginTop: 40,
        backgroundColor: "#FF3B30",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

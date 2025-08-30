import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { saveToken } from "../Utils/token";

export default function AuthScreen({ navigation }) {
    const [isLogin, setIsLogin] = useState(true); // toggle between Login / Signup
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const API_URL = "http://192.168.29.181:4000/auth"; // replace with your backend URL

    const handleAuth = async () => {
        try {
            const endpoint = isLogin ? "login" : "register";
            const payload = isLogin
                ? { email, password }
                : { name, email, password, role: "patient" };

            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Error", data.message || "Something went wrong");
                return;
            }

            // Success
            await saveToken(data.token);
            Alert.alert("Success", isLogin ? "Login Successful" : "Registered Successfully");

            // Navigate to Main Tabs (Doctors/Bookings/Profile)
            navigation.replace("MainTabs");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Unable to connect to server");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? "Sign In" : "Sign Up"}</Text>

            {!isLogin && (
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleAuth}>
                <Text style={styles.buttonText}>
                    {isLogin ? "Login" : "Register"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.switchText}>
                    {isLogin
                        ? "Don't have an account? Sign Up"
                        : "Already have an account? Sign In"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

/* -------- Styles -------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 25,
        backgroundColor: "#f9fdfb",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#00C46B",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#00C46B",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    switchText: {
        textAlign: "center",
        color: "#555",
        marginTop: 10,
    },
});

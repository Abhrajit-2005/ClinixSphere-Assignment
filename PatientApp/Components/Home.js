import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Full Screen Background Image */}
            <ImageBackground
                source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDutyNtTVIAtSbVQeukrioCI-rHOdUA5xKXUExi_retxMSOmNlqp-hOQ-fnruvVuAuXkCHCE5yonYEeMP_xPDBZXfOipPw69o9pH-FeKokrIELvuZ5Km_fZOQd7jA6OO8jl3hofOlW5PX_TqdgHz3H35PJYOAl7GphshJ2sS-cU5g_JrrtvcXImWEAgAf5ljCa5dYe2CZsgSHZ-yzOb_5MW3WBsuJ2zJRYkZN8gaCxWxV3v-kUJcBQPFEE6bviqAly-Fgs_xgQcFRO0", // <-- replace with your live image
                }}
                style={styles.image}
                resizeMode="cover"
            >
                {/* Overlay to darken background slightly */}
                <View style={styles.overlay} />

                {/* Animated Text Section */}
                <Animatable.View
                    animation="fadeInUp"
                    duration={1500}
                    delay={500}
                    style={styles.textContainer}
                >
                    <Animatable.Text animation="fadeInDown" duration={1500} style={styles.title}>
                        Find Your Perfect Doctor
                    </Animatable.Text>

                    <Animatable.Text animation="fadeInUp" duration={2000} delay={1000} style={styles.subtitle}>
                        Book appointments, view upcoming visits, and manage your health
                        information all in one place.
                    </Animatable.Text>
                </Animatable.View>

                {/* Animated Button */}
                <Animatable.View animation="bounceIn" delay={2000}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Auth")}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    image: {
        flex: 1,
        width: "100%",
        height: "55%",
        justifyContent: "flex-end", // content sticks at bottom
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)", // darken background a bit
    },
    textContainer: {
        paddingHorizontal: 20,
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#0b1546ff",
        textAlign: "center",
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 20,
        color: "#ffffffff",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#032013ff",
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        marginBottom: 100,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

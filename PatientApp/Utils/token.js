import AsyncStorage from "@react-native-async-storage/async-storage";

// Save token
const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem("authToken", token);
    } catch (e) {
        console.error("Error saving token", e);
    }
};

// Get token
const getToken = async () => {
    try {
        return await AsyncStorage.getItem("authToken");
    } catch (e) {
        console.error("Error fetching token", e);
        return null;
    }
};

// Remove token (logout)
const removeToken = async () => {
    try {
        await AsyncStorage.removeItem("authToken");
    } catch (e) {
        console.error("Error removing token", e);
    }
};
export { saveToken, getToken, removeToken };
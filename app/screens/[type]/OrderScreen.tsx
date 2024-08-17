import React, { useState, useEffect } from "react";
import { ScrollView, Text, TextInput, View, ActivityIndicator } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import tw from "twrnc";
import { coordsInfo } from "@/interface";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";
import { color } from "@/app/styling";
import { doc, setDoc } from "firebase/firestore";
import { FB_AUTH, FS_DB } from "@/FirebaseConfig";

function generateRandomUid(length: number = 8): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function OrderScreen({ route, navigation }: any) {
    const [address, setAddress] = useState<string>("");
    const [weight, setWeight] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<coordsInfo | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const { wasteCategory } = route.params;
    const db = FS_DB;

    const createOrder = async () => {
        const user = FB_AUTH.currentUser;
        if (user) {
            const randomUid = generateRandomUid();
            const orderData = {
                address: address,
                weight: weight,
                time: Date.now(),
                category: wasteCategory,
            };
            try {
                await setDoc(doc(db, `users/${user.uid}/history/${randomUid}`), orderData, { merge: true });
                console.log("Order stored in history with ID: ", randomUid);
            } catch (error) {
                setError("Failed to store order. Please try again.");
                console.error("Error writing document: ", error);
            }
        }
    };

    const handleOrder = async () => {
        setLoading(true);
        await createOrder();
        setLoading(false);
        navigation.navigate("Menu");
    };

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setLocationError("Permission to access location was denied");
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setUserLocation(location);
            } catch (error) {
                setLocationError("Failed to fetch location. Please try again.");
            }
        })();
    }, []);

    return (
        <SafeAreaView>
            <MapView
                style={tw`w-full h-full`}
                initialRegion={{
                    latitude: userLocation?.coords.latitude || 0.7893,
                    longitude: userLocation?.coords.longitude || 113.9213,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
            />
            <View
                style={{
                    height: "50%",
                    backgroundColor: "white",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
            >
                <View
                    style={{
                        padding: 20,
                        backgroundColor: color.primaryColor,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        shadowColor: "#171717",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 20,
                        shadowOffset: { width: -2, height: 0 },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        elevation: 2,
                    }}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="left" color={"white"} size={15}></Icon>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: "bold", color: "white" }}>{wasteCategory}</Text>
                </View>
                <ScrollView style={{ padding: 20 }}>
                    <View>
                        <Text>Weight (kg)</Text>
                        <TextInput
                            onChangeText={(text) => setWeight(parseInt(text))}
                            keyboardType="number-pad"
                            value={weight.toString()}
                            style={{
                                height: 40,
                                width: 80,
                                borderColor: "gray",
                                borderWidth: 1,
                                marginTop: 10,
                                padding: 10,
                            }}
                        />
                    </View>
                    <View>
                        <Text>Address</Text>
                        <TextInput
                            onChangeText={(text) => setAddress(text)}
                            value={address}
                            style={{
                                height: 40,
                                width: "100%",
                                borderColor: "gray",
                                borderWidth: 1,
                                marginTop: 10,
                                padding: 10,
                            }}
                            placeholder="manual input (automatic location still in development)"
                        />
                    </View>
                    <TouchableOpacity
                        style={{ marginTop: 20, backgroundColor: loading ? "#ccc" : color.primaryColor, padding: 10, borderRadius: 10, height: 40 }}
                        onPress={handleOrder}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "white", textAlign: "center" }}>Order</Text>}
                    </TouchableOpacity>
                    {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
                    {locationError && <Text style={{ color: "red", marginTop: 10 }}>{locationError}</Text>}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default OrderScreen;

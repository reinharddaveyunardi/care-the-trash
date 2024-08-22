import React, { useState, useEffect } from "react";
import { ScrollView, Text, TextInput, View, ActivityIndicator } from "react-native";
import MapView, { Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import tw from "twrnc";
import { coordsInfo } from "@/interface";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";
import { color } from "@/app/styling";
import { doc, setDoc } from "firebase/firestore";
import { FB_AUTH, FS_DB } from "@/FirebaseConfig";
import MapViewDirections from "react-native-maps-directions";

const GOOGLE_GEOCODING_API_KEY = "AIzaSyDZ1efMT-saXsY1sjx0ZMJ1ofBkfLaOa-A";
const GOOGLE_DIRECTIONS_API_KEY = "AIzaSyDZ1efMT-saXsY1sjx0ZMJ1ofBkfLaOa-A";

function generateRandomUid(length: number = 8): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const OrderScreen: React.FC<any> = ({ route, navigation }) => {
    const [address, setAddress] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<coordsInfo | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isOrderClicked, setIsOrderClicked] = useState<boolean>(false);

    const destination = {
        latitude: -6.365503,
        longitude: 106.978508,
    };
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
        setIsOrderClicked(true);
        setTimeout(() => {
            navigation.navigate("Menu");
        }, 15000);
    };
    const getPlaceNameFromCoordinates = async (latitude: number, longitude: number) => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_GEOCODING_API_KEY}`);
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            return data.results[0].formatted_address;
        } else {
            throw new Error("Unable to get place name");
        }
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
                setUserLocation({
                    coords: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                });
                if (location.coords) {
                    const address = await getPlaceNameFromCoordinates(location.coords.latitude, location.coords.longitude);
                    setAddress(address);
                }
                console.log(location);
            } catch (error) {
                setLocationError("Failed to fetch location. Please try again.");
            }
        })();
    }, []);

    return (
        <SafeAreaView style={tw`flex-1`}>
            {userLocation ? (
                <MapView
                    style={tw`w-full h-full`}
                    initialRegion={{
                        latitude: userLocation.coords.latitude,
                        longitude: userLocation.coords.longitude,
                        latitudeDelta: 0.0009,
                        longitudeDelta: 0.0009,
                    }}
                    showsUserLocation={true}
                >
                    {destination && isOrderClicked && (
                        <MapViewDirections origin={userLocation.coords} destination={destination} apikey={GOOGLE_DIRECTIONS_API_KEY} strokeWidth={5} strokeColor="#047ae0" />
                    )}
                </MapView>
            ) : (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color={color.primaryColor} />
                    <Text>Loading Map...</Text>
                </View>
            )}

            {!isOrderClicked && (
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
                                onChangeText={(weight) => setWeight(weight)}
                                placeholder="0"
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
                                placeholder="Search or input address"
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
            )}
        </SafeAreaView>
    );
};

export default OrderScreen;

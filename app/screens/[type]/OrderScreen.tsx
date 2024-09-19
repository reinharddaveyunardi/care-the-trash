import React, { useState, useEffect, useRef, useCallback } from "react";
import { ScrollView, Text, TextInput, View, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import tw from "twrnc";
import { coordsInfo } from "@/interface";
import { TouchableOpacity } from "react-native-gesture-handler";
import { color } from "@/app/styling";
import { doc, setDoc } from "firebase/firestore";
import { FB_AUTH, FS_DB } from "@/FirebaseConfig";
import MapViewDirections from "react-native-maps-directions";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

const GOOGLE_GEOCODING_API_KEY = "AIzaSyA2DdOLtXjToPJjAGMQGAGq6qV9LXwNAR0";

function generateRandomUid(length: number = 16): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const OrderScreen: React.FC<any> = ({ route, navigation }) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [address, setAddress] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<coordsInfo | null>(null);
    const [isOrderClicked, setIsOrderClicked] = useState<boolean>(false);
    const [distance, setDistance] = useState<number | null>(null);
    const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);

    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);

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
                distance: distance,
                uidOrder: randomUid,
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
            navigation.navigate("Receipt", {
                address,
                weight,
                distance,
                wasteCategory,
                destination: destination,
                uidOrder: generateRandomUid(),
            });
        }, 3000);
    };
    const getPlaceNameFromCoordinates = async (latitude: any, longitude: any) => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_GEOCODING_API_KEY}`);
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            const fullAddress = data.results[0].formatted_address;
            return cleanAddress(fullAddress);
        } else {
            throw new Error("Unable to get place name");
        }
    };

    const cleanAddress = (fullAddress: string) => {
        let cleanedAddress = fullAddress.replace(/^[A-Za-z0-9\+]+,\s*/, "");
        const regex = /(Kabupaten|Kota|Provinsi|Kec\.)\s.+$/;
        cleanedAddress = cleanedAddress.replace(regex, "").trim();
        return cleanedAddress;
    };
    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setError("Permission to access location was denied");
                    return;
                }

                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
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
            } catch (error) {
                setError("Failed to fetch location. Please try again.");
            }
        })();
    }, []);

    const handleReady = (result: any) => {
        const distanceInKm = result.distance;
        setDistance(distanceInKm);
        setIsCalculatingRoute(false);
    };

    const handleError = (error: any) => {
        console.error("Error calculating route: ", error);
        setIsCalculatingRoute(false);
        setError("Failed to calculate route. Please try again.");
    };

    function formatDistance(distance: number) {
        return distance < Math.floor(distance) + 0.5 ? Math.floor(distance) : Math.round(distance);
    }

    return (
        <SafeAreaView style={tw`flex-1 h-full`}>
            {!isOrderClicked ? (
                <View style={styles.container}>
                    <MapViewUser userLocation={userLocation} destination={destination} setIsCalculatingRoute={setIsCalculatingRoute} handleReady={handleReady} handleError={handleError} />

                    <BottomSheet ref={bottomSheetRef} onChange={handleSheetChanges} snapPoints={["10%", "50%"]}>
                        <BottomSheetView style={styles.contentContainer}>
                            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                                <View style={{ padding: 24 }}>
                                    <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        <View style={{ alignItems: "center", display: "flex", gap: 10, flexDirection: "row" }}>
                                            <Text style={{ fontSize: 14 }}>{wasteCategory}</Text>
                                            <Text>
                                                {wasteCategory === "Organic" ? <FontAwesome6 name="leaf" size={24} color="green" /> : <FontAwesome6 name="bottle-water" size={24} color="blue" />}
                                            </Text>
                                        </View>
                                        <View style={{ display: "flex" }}>
                                            <View style={{ width: "90%", height: 1, backgroundColor: "black", borderRadius: 10 }} />
                                        </View>
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
                                            <Text>From</Text>
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
                                        <View>
                                            <Text>To</Text>
                                            <TextInput
                                                aria-disabled
                                                editable={false}
                                                value="Bantar Gebang"
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
                                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "white", textAlign: "center" }}>Order {formatDistance(distance || 0)} km</Text>}
                                        </TouchableOpacity>
                                        {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
                                    </View>
                                </View>
                            </ScrollView>
                        </BottomSheetView>
                    </BottomSheet>
                </View>
            ) : (
                <MapViewUser userLocation={userLocation} destination={destination} setIsCalculatingRoute={setIsCalculatingRoute} handleReady={handleReady} handleError={handleError} />
            )}
        </SafeAreaView>
    );
};

const MapViewUser = ({
    userLocation,
    destination,
    setIsCalculatingRoute,
    handleReady,
    handleError,
}: {
    userLocation: any;
    destination: any;
    setIsCalculatingRoute: any;
    handleReady: any;
    handleError: any;
}) => {
    return (
        <>
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
                    {destination && (
                        <MapViewDirections
                            onReady={handleReady}
                            onError={handleError}
                            onStart={() => setIsCalculatingRoute(true)}
                            apikey={"AIzaSyBrGJDA2SfZPp5F4jgqFzMYmEtIo9m2BmM"}
                            origin={userLocation.coords}
                            destination={destination}
                            strokeWidth={5}
                            strokeColor="#047ae0"
                        />
                    )}
                </MapView>
            ) : (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color={color.primaryColor} />
                    <Text>Loading Map...</Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "grey",
    },
    contentContainer: {
        flex: 1,
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: color.white,
    },
});
export default OrderScreen;

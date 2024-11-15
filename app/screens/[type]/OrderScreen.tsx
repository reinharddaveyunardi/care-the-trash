import React, {useState, useEffect, useRef} from "react";
import {ScrollView, Text, TextInput, View, ActivityIndicator, StyleSheet, StatusBar} from "react-native";
import MapView, {Region} from "react-native-maps";
import {SafeAreaView} from "react-native-safe-area-context";
import * as Location from "expo-location";
import tw from "twrnc";
import {coordsInfo} from "@/interface";
import {TouchableOpacity} from "react-native-gesture-handler";
import {color} from "@/app/styling";
import {doc, increment, setDoc, updateDoc} from "firebase/firestore";
import {FB_AUTH, FS_DB} from "@/services/FirebaseConfig";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {FontAwesome6} from "@expo/vector-icons";
import {ColorPallet} from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserMapView from "@/components/UserMapView";
import {destination, expObtained, generateRandomUid, getPlaceNameFromCoordinates, pointObtained} from "@/utils";
import {createOrder} from "@/services/api";

const OrderScreen: React.FC<any> = ({route, navigation}) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [address, setAddress] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [isSatelite, setIsSatelite] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<coordsInfo | null>(null);
    const [isOrderClicked, setIsOrderClicked] = useState<boolean>(false);
    const [region, setRegion] = useState<Region | null>(null);
    const [distance, setDistance] = useState<number>(0);
    const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);

    const handleChangeMap = () => setIsSatelite((prev) => !prev);
    const {wasteCategory} = route.params;

    const handleOrder = async () => {
        setLoading(true);
        await createOrder({address, weight, wasteCategory, distance});
        setLoading(false);
        setIsOrderClicked(true);
        setTimeout(() => {
            navigation.navigate("Receipt", {
                address,
                weight,
                distance,
                status: true,
                wasteCategory,
                destination: destination,
                pointObtained: pointObtained(weight, distance),
                expObtained: expObtained(weight, distance),
                uidOrder: generateRandomUid(),
            });
        }, 3000);
    };

    useEffect(() => {
        (async () => {
            try {
                let {status} = await Location.requestForegroundPermissionsAsync();
                await AsyncStorage.setItem("locationPerm", "true");
                if (status !== "granted") {
                    setError("Permission to access location was denied");
                    console.log(status);
                    navigation.navigate("Menu");
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

    useEffect(() => {
        if (userLocation) {
            setRegion({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        }
    }, [userLocation]);
    const handleError = (error: any) => {
        console.error("Error calculating route: ", error);
        setIsCalculatingRoute(false);
        setError("Failed to calculate route. Please try again.");
    };
    const mapStyle = [
        {
            featureType: "all",
            elementType: "labels",
            stylers: [{visibility: "off"}],
        },
    ];
    function formatDistance(distance: number) {
        return distance < Math.floor(distance) + 0.5 ? Math.floor(distance) : Math.round(distance);
    }
    if (!loading) {
        bottomSheetRef.current?.expand();
    }
    return (
        <SafeAreaView style={tw`flex-1 h-full`}>
            <StatusBar backgroundColor={wasteCategory === "Organic" ? ColorPallet.primary : ColorPallet.blue} barStyle={"light-content"} />
            {!isOrderClicked ? (
                <View style={styles.container}>
                    <UserMapView
                        isSatelite={isSatelite}
                        waste={wasteCategory}
                        userLocation={userLocation}
                        destination={destination}
                        setIsCalculatingRoute={setIsCalculatingRoute}
                        handleReady={handleReady}
                        handleError={handleError}
                    />
                    {!loading && (
                        <View style={{position: "absolute", alignItems: "center", justifyContent: "center", marginTop: 20, marginLeft: 20}}>
                            <Text style={isSatelite ? {color: ColorPallet.white, fontSize: 16} : {color: ColorPallet.primary, fontSize: 16}}>
                                <TouchableOpacity onPress={handleChangeMap}>
                                    <MapView
                                        customMapStyle={mapStyle}
                                        zoomControlEnabled={false}
                                        rotateEnabled={false}
                                        scrollEnabled={false}
                                        mapType={isSatelite ? "standard" : "satellite"}
                                        region={region as Region}
                                        style={{width: 70, height: 70, borderRadius: 20}}
                                    />
                                </TouchableOpacity>
                            </Text>
                        </View>
                    )}

                    <BottomSheet ref={bottomSheetRef} snapPoints={["10%", "50%"]}>
                        <BottomSheetView style={styles.contentContainer}>
                            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                                <View style={{padding: 24}}>
                                    <View style={{display: "flex", flexDirection: "column", gap: 16}}>
                                        <View style={{alignItems: "center", display: "flex", gap: 10, flexDirection: "row"}}>
                                            <Text style={{fontSize: 14}}>{wasteCategory}</Text>
                                            <Text>
                                                {wasteCategory === "Organic" ? (
                                                    <FontAwesome6 name="leaf" size={24} color={ColorPallet.primary} />
                                                ) : (
                                                    <FontAwesome6 name="bottle-water" size={24} color={ColorPallet.blue} />
                                                )}
                                            </Text>
                                        </View>
                                        <View style={{display: "flex"}}>
                                            <View
                                                style={{
                                                    width: "100%",
                                                    height: 4,
                                                    backgroundColor: wasteCategory === "Organic" ? ColorPallet.primary : ColorPallet.blue,
                                                    borderRadius: 10,
                                                }}
                                            />
                                        </View>
                                        <View>
                                            <Text>Weight (kg)</Text>
                                            <TextInput
                                                onChangeText={(weight) => setWeight(weight)}
                                                placeholder="0"
                                                keyboardType="number-pad"
                                                value={weight.toString()}
                                                style={{
                                                    borderRadius: 10,
                                                    height: 40,
                                                    width: 80,
                                                    borderColor: wasteCategory === "Organic" ? ColorPallet.primary : ColorPallet.blue,
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
                                                value={!address ? "Loading location..." : address}
                                                style={{
                                                    borderRadius: 10,
                                                    height: 40,
                                                    width: "100%",
                                                    borderColor: wasteCategory === "Organic" ? ColorPallet.primary : ColorPallet.blue,
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
                                                    borderRadius: 10,
                                                    height: 40,
                                                    width: "100%",
                                                    opacity: 0.4,
                                                    borderColor: wasteCategory === "Organic" ? ColorPallet.primary : ColorPallet.blue,
                                                    borderWidth: 1,
                                                    marginTop: 10,
                                                    padding: 10,
                                                }}
                                                placeholder="Search or input address"
                                            />
                                        </View>
                                        {loading ? (
                                            <ActivityIndicator color={wasteCategory === "Organic" ? ColorPallet.primary : ColorPallet.blue} />
                                        ) : (
                                            <TouchableOpacity
                                                style={{
                                                    marginTop: 20,
                                                    backgroundColor: wasteCategory === "Organic" ? ColorPallet.primary : ColorPallet.blue,
                                                    padding: 10,
                                                    borderRadius: 10,
                                                    height: 40,
                                                }}
                                                onPress={handleOrder}
                                                disabled={loading}
                                            >
                                                <Text style={{color: "white", textAlign: "center"}}>Order {formatDistance(distance || 0)} km</Text>
                                            </TouchableOpacity>
                                        )}
                                        {error && <Text style={{color: "red", marginTop: 10}}>{error}</Text>}
                                    </View>
                                </View>
                            </ScrollView>
                        </BottomSheetView>
                    </BottomSheet>
                </View>
            ) : (
                <UserMapView
                    isSatelite={isSatelite}
                    waste={wasteCategory}
                    userLocation={userLocation}
                    destination={destination}
                    setIsCalculatingRoute={setIsCalculatingRoute}
                    handleReady={handleReady}
                    handleError={handleError}
                />
            )}
        </SafeAreaView>
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
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: color.white,
    },
});
export default OrderScreen;

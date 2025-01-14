import React, {useState, useEffect, useRef} from "react";
import {Text, TextInput, View, ActivityIndicator, StyleSheet, StatusBar} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import * as Location from "expo-location";
import tw from "twrnc";
import {coordsInfo} from "@/interface";
import {TouchableOpacity} from "react-native-gesture-handler";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {Ionicons} from "@expo/vector-icons";
import {FontAwesome6} from "@expo/vector-icons";
import {ColorPallet} from "@/constants/Colors";
import UserMapView from "@/components/UserMapView";
import {createOrder} from "@/services/api";
import {expObtained, getPlaceNameFromCoordinates, pointObtained} from "@/utils";
const OrderScreen: React.FC<any> = ({route, navigation}) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [address, setAddress] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isOrderClicked, setIsOrderClicked] = useState<boolean>(false);
    const [distance, setDistance] = useState<number>(0);
    const {wasteCategory} = route.params;

    const handleOrder = async () => {
        setLoading(true);
        await createOrder({address: address, weight: weight, wasteCategory: wasteCategory, distance: distance});
        setLoading(false);
        setIsOrderClicked(true);
        setTimeout(() => {
            navigation.navigate("Receipt", {
                address: address,
                weight: weight,
                time: Date.now(),
                category: wasteCategory,
                distance: distance,
                pointObtained: pointObtained(weight, distance),
                expObtained: expObtained(weight, distance),
            });
        }, 3000);
    };
    useEffect(() => {
        (async () => {
            try {
                let {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setError("Permission to access location was denied");
                    navigation.goBack();
                    return;
                }
                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
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

    const handleError = (error: any) => {
        console.error("Error calculating route: ", error);
        setError("Failed to calculate route. Please try again.");
    };

    return (
        <SafeAreaView style={tw`flex-1 h-full`}>
            <StatusBar barStyle="light-content" backgroundColor={wasteCategory === "Organic" ? ColorPallet.primary : ColorPallet.blue} />
            {!isOrderClicked ? (
                <View style={styles.container}>
                    <UserMapView navigation={navigation} handleError={handleError} waste={wasteCategory} />
                    <View style={{position: "absolute", top: "2%", left: "2.5%", justifyContent: "center", alignItems: "center", elevation: 5, zIndex: 2}}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{display: "flex", alignItems: "center", backgroundColor: "white", borderRadius: 50, padding: 10}}
                        >
                            <Ionicons name="chevron-back" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <BottomSheet ref={bottomSheetRef} snapPoints={["10%", "55%"]} style={{flex: 1}}>
                        <BottomSheetView style={styles.contentContainer}>
                            <View style={{padding: 24}}>
                                <View style={{display: "flex", flexDirection: "column", gap: 16}}>
                                    <View style={{alignItems: "center", display: "flex", gap: 10, flexDirection: "row"}}>
                                        <Text style={{fontSize: 14}}>{wasteCategory}</Text>
                                        <Text>
                                            {wasteCategory === "Organic" ? (
                                                <FontAwesome6 name="leaf" size={24} color="green" />
                                            ) : (
                                                <FontAwesome6 name="bottle-water" size={24} color="blue" />
                                            )}
                                        </Text>
                                    </View>
                                    <View style={{display: "flex"}}>
                                        <View
                                            style={{
                                                width: "100%",
                                                height: 3,
                                                backgroundColor: wasteCategory === "Organic" ? "green" : "blue",
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
                                                height: 40,
                                                width: 80,
                                                borderColor: wasteCategory === "Organic" ? "green" : "blue",
                                                borderWidth: 1,
                                                borderRadius: 10,
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
                                                borderColor: wasteCategory === "Organic" ? "green" : "blue",
                                                borderWidth: 1,
                                                borderRadius: 10,
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
                                                borderColor: wasteCategory === "Organic" ? "green" : "blue",
                                                opacity: 0.5,
                                                borderWidth: 1,
                                                marginTop: 10,
                                                padding: 10,
                                                borderRadius: 10,
                                            }}
                                        />
                                    </View>
                                    {loading ? (
                                        <ActivityIndicator size="large" color={ColorPallet.primary} />
                                    ) : parseInt(weight) > 0 ? (
                                        <TouchableOpacity
                                            style={{
                                                marginTop: 20,
                                                backgroundColor: wasteCategory === "Organic" ? ColorPallet.primary : ColorPallet.primary,
                                                padding: 10,
                                                borderRadius: 10,
                                                height: 40,
                                            }}
                                            onPress={handleOrder}
                                            disabled={loading}
                                        >
                                            <Text style={{color: "white", textAlign: "center"}}>Order</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={{
                                                marginTop: 20,
                                                backgroundColor: loading ? "#ccc" : ColorPallet.warning,
                                                padding: 10,
                                                borderRadius: 10,
                                                height: 40,
                                            }}
                                            onPress={handleOrder}
                                            disabled={true}
                                        >
                                            <Text style={{color: "white", textAlign: "center"}}>Please enter weight</Text>
                                        </TouchableOpacity>
                                    )}
                                    {error && <Text style={{color: "red", marginTop: 10}}>{error}</Text>}
                                </View>
                            </View>
                        </BottomSheetView>
                    </BottomSheet>
                </View>
            ) : (
                <UserMapView navigation={navigation} handleError={handleError} waste={wasteCategory} />
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
        backgroundColor: ColorPallet.white,
    },
});
export default OrderScreen;

import {ActivityIndicator, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {coordsInfo, MapProps} from "@/interface";
import MapView from "react-native-maps";
import tw from "twrnc";
import * as Location from "expo-location";
import {destination, onDistanceChange} from "@/utils";
import MapViewDirections from "react-native-maps-directions";
import {ColorPallet} from "@/constants/Colors";

export default function UserMapView({setIsCalculatingRoute, handleReady, handleError, waste, navigation}: MapProps) {
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<coordsInfo | any>(null);
    useEffect(() => {
        (async () => {
            try {
                let {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    navigation.goBack();
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
            } catch (error) {
                setError("Failed to fetch location. Please try again.");
            }
        })();
    }, []);
    return (
        <>
            {userLocation !== null ? (
                <MapView
                    style={tw`w-full h-full`}
                    initialRegion={{
                        latitude: userLocation.coords.latitude,
                        longitude: userLocation.coords.longitude,
                        latitudeDelta: 0.0009,
                        longitudeDelta: 0.0009,
                    }}
                    showsUserLocation={true}
                    showsPointsOfInterest={false}
                    showsCompass={true}
                    showsBuildings={true}
                    showsMyLocationButton={true}
                    followsUserLocation
                    onRegionChange={() => onDistanceChange(userLocation, destination)}
                >
                    {destination && (
                        <MapViewDirections
                            onReady={handleReady}
                            onError={handleError}
                            onStart={() => setIsCalculatingRoute(true)}
                            apikey={process.env.EXPO_PUBLIC_MAPS_API_KEY || "AIzaSyBoHxlKMQIhIeWkUTz7VsqwPgrnBe-F9M0"}
                            origin={userLocation.coords}
                            destination={destination}
                            strokeWidth={5}
                            optimizeWaypoints
                            precision="high"
                            strokeColor={waste === "Organic" ? ColorPallet.primary : ColorPallet.blue}
                        />
                    )}
                </MapView>
            ) : (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color={ColorPallet.primary} />
                    <Text>Loading Map...</Text>
                </View>
            )}
        </>
    );
}

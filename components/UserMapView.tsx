import {ActivityIndicator, Text, View} from "react-native";
import React from "react";
import {MapProps} from "@/interface";
import {color} from "@/app/styling";
import MapView from "react-native-maps";
import tw from "twrnc";
import {onDistanceChange} from "@/utils";
import MapViewDirections from "react-native-maps-directions";
import {ColorPallet} from "@/constants/Colors";

export default function UserMapView({isSatelite, userLocation, destination, setIsCalculatingRoute, handleReady, handleError, waste}: MapProps) {
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
                    mapType={isSatelite ? "satellite" : "standard"}
                    showsPointsOfInterest={false}
                    showsCompass={true}
                    showsBuildings={true}
                    showsMyLocationButton={false}
                    followsUserLocation
                    onRegionChange={() => onDistanceChange(userLocation, destination)}
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
                            optimizeWaypoints
                            precision="high"
                            strokeColor={waste === "Organic" ? ColorPallet.primary : ColorPallet.blue}
                        />
                    )}
                </MapView>
            ) : (
                <View style={tw`flex-1 justify-center items-center`}>
                    {/* <ActivityIndicator size="large" color={color.primaryColor} /> */}
                    <Text>Loading Map...</Text>
                </View>
            )}
        </>
    );
}

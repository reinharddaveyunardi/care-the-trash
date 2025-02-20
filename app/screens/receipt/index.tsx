import React, {useEffect, useState} from "react";
import {SafeAreaView, Text, View, TouchableOpacity} from "react-native";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import {format} from "date-fns";
import {FS_DB} from "@/services/FirebaseConfig";
import {ColorPallet} from "@/constants/Colors";
function formatPrice(number: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(number);
}

function formatDistance(distance: number) {
    return distance < Math.floor(distance) + 0.5 ? Math.floor(distance) : Math.round(distance);
}

function getCatPic(category: string) {
    switch (category) {
        case "Organic":
            return (
                <View>
                    <Text style={{opacity: 0.2}}>
                        <Ionicons name="leaf-outline" size={400} color={"#54B159"} style={{position: "absolute", transform: [{rotate: "-45deg"}], top: 160}} />
                    </Text>
                </View>
            );
        case "Inorganic":
            return (
                <View>
                    <Text style={{opacity: 0.2}}>
                        <Ionicons name="water-outline" size={400} color={"#28BBDB"} style={{position: "absolute", transform: [{rotate: "-45deg"}], top: 160}} />
                    </Text>
                </View>
            );

        default:
    }
}

const ReceiptScreen: React.FC<any> = ({route, navigation}) => {
    const [timeFilter, setTimeFilter] = useState<Date | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
    const {address, weight, distance, wasteCategory, time, expObtained, pointObtained} = route.params;
    const formattedOrderTime = time ? format(new Date(time), "MM/dd/yyyy HH:mm") : "N/A";
    const db = FS_DB;

    const applyFilters = () => {
        let filtered = [...history];
        if (timeFilter) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.time);
                return itemDate.toDateString() === timeFilter.toDateString();
            });
        }

        setFilteredHistory(filtered);
    };
    useEffect(() => {
        applyFilters();
    }, [timeFilter]);

    return (
        <SafeAreaView style={tw`flex-1 mt-10 flex-col justify-between`}>
            <View>
                <View style={{justifyContent: "center", alignItems: "center", marginTop: 70}}>
                    <Text style={{fontSize: 30, fontWeight: "bold"}}>Receipt</Text>
                    {/* {filteredHistory.map((item) => (
                        <View key={item.id}>
                            <Text>Time: {format(new Date(item.time), "MM/dd/yyyy HH:mm")}</Text>
                        </View>
                    ))} */}
                </View>
                <View style={{justifyContent: "center", alignItems: "center", marginTop: 20}}>
                    <View style={{justifyContent: "center", width: "90%", height: 1, backgroundColor: "black"}} />
                </View>
                <View style={{padding: 20, display: "flex", flexDirection: "column", gap: 10}}>
                    <Text style={{fontSize: 16, fontWeight: "bold", opacity: 0.7}}>Category: {wasteCategory}</Text>
                    <Text style={{fontSize: 16, fontWeight: "bold", opacity: 0.7}}>Weight: {weight} kg</Text>
                    <Text style={{fontSize: 16, fontWeight: "bold", opacity: 0.7}}>Destination: Bantar Gebang</Text>
                    <Text style={{fontSize: 16, fontWeight: "bold", opacity: 0.7}}>Address: {address}</Text>
                    <Text style={{fontSize: 16, fontWeight: "bold", opacity: 0.7}}>Distance: {formatDistance(distance)} km</Text>
                </View>
                <View style={{justifyContent: "center", alignItems: "center", marginTop: 20}}>
                    <View style={{justifyContent: "center", width: "90%", height: 1, backgroundColor: "black"}} />
                </View>
                <View style={{padding: 20, display: "flex", flexDirection: "column", gap: 10}}>
                    <Text>Cost: {formatPrice(weight * 400 * distance)}</Text>
                    <Text>Exp obtained: {expObtained}</Text>
                    <Text>Point obtained: {pointObtained}</Text>
                </View>
                <View>{getCatPic(wasteCategory)}</View>
            </View>
            <View style={{padding: 20, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Menu")}
                    style={{padding: 10, backgroundColor: ColorPallet.primary, width: "90%", borderRadius: 10}}
                >
                    <Text style={{textAlign: "center", color: "white"}}>Go to Menu</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ReceiptScreen;

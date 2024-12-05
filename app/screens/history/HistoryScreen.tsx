import React, {useState} from "react";
import {RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {ColorPallet} from "@/constants/Colors";
import {getHistory} from "@/services/api";
import {format} from "date-fns";
import {refreshHandler} from "@/services/handler";

const HistoryScreen = ({navigation}: any) => {
    const [filteredHistory, setFilteredHistory] = useState<any>([]);
    const [refresh, setRefresh] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const history = await getHistory();
            setFilteredHistory(history);
        } catch (error) {
            console.log(error);
        }
    };

    if (!fetched) {
        setTimeout(() => {
            fetchHistory();
            setLoading(false);
            setFetched(true);
        }, 1000);
    }

    function formatPrice(number: number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);
    }

    function getCatPic(category: string) {
        switch (category) {
            case "Organic":
                return <Ionicons name="leaf-outline" size={40} color={ColorPallet.primary} />;
            case "Inorganic":
                return <Ionicons name="water" size={40} color={ColorPallet.blue} />;
            default:
        }
    }

    const onRefresh = () => {
        setLoading(true);
        setRefresh(true);
        fetchHistory();
        setTimeout(() => {
            setLoading(false);
            setRefresh(false);
        }, 2000);
    };
    return (
        <SafeAreaView>
            <StatusBar backgroundColor={ColorPallet.primary} />
            <View style={{top: "2%", width: "100%", zIndex: 10}}>
                <View style={{flexDirection: "row", marginHorizontal: "4.5%", justifyContent: "space-between", alignItems: "center", height: 50}}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                        <Ionicons name="arrow-back" size={20} color={ColorPallet.black} />
                        <Text>Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{padding: 20, top: 20}}>
                <Text style={{fontSize: 18, fontWeight: "bold"}}>Order History</Text>
                <ScrollView
                    style={{height: "100%"}}
                    refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => refreshHandler({refreshContent: onRefresh})} />}
                >
                    <View style={{flex: 1, height: "100%", gap: 10}}>
                        {filteredHistory && filteredHistory.length > 0 ? (
                            filteredHistory.map((item: any) => (
                                <View key={item.id}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate("Receipt", {
                                                address: item.address,
                                                weight: item.weight,
                                                distance: item.distance,
                                                wasteCategory: item.category,
                                                time: item.time,
                                                pointObtained: item.pointObtained,
                                                expObtained: item.expObtained,
                                            })
                                        }
                                        activeOpacity={0.5}
                                        style={{
                                            padding: 10,
                                            gap: 5,
                                            display: "flex",
                                            flexDirection: "row",
                                            borderRadius: 15,
                                            alignItems: "center",
                                            justifyContent: "space-around",
                                            backgroundColor: ColorPallet.white,
                                        }}
                                    >
                                        <View style={{height: 80, justifyContent: "center", alignItems: "center"}}>
                                            {filteredHistory ? <View>{getCatPic(item.category)}</View> : null}
                                        </View>
                                        <View style={{height: 80, width: 1, backgroundColor: ColorPallet.primary}} />
                                        <View style={{flexDirection: "row", height: 80}}>
                                            <View style={{justifyContent: "space-between"}}>
                                                <View style={{gap: 10}}>
                                                    <Text style={{fontWeight: "bold"}}>
                                                        {item.address.length > 20 ? item.address.substring(0, 23) + "..." : item.address}
                                                    </Text>
                                                    <View>
                                                        <Text>{format(new Date(item.time), "dd MMM - HH:mm")}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: "row", justifyContent: "space-between", gap: 5}}>
                                                    <View style={{backgroundColor: ColorPallet.primary, paddingHorizontal: 5, borderRadius: 5}}>
                                                        {!loading ? (
                                                            <Text style={{color: ColorPallet.white, textAlign: "center"}}>
                                                                {item.status ? "Delivered" : "Pending"}
                                                            </Text>
                                                        ) : null}
                                                    </View>
                                                    <Text>{formatPrice(item.weight * 400 * item.distance)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={{alignItems: "center", justifyContent: "center", flex: 1, height: "100%", marginTop: "80%"}}>
                                {loading ? (
                                    <View style={{alignItems: "center", justifyContent: "center", flex: 1, height: "100%"}}>
                                        <Text>Loading...</Text>
                                    </View>
                                ) : (
                                    <View style={{alignItems: "center", justifyContent: "center", flex: 1, height: "100%"}}>
                                        <Text>No history found</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default HistoryScreen;

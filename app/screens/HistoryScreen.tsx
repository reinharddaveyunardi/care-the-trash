import React, { useState, useEffect } from "react";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FB_AUTH, FS_DB } from "@/FirebaseConfig";
import { doc, getDocs, collection, query } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";

const HistoryScreen = ({ navigation }: any) => {
    const [history, setHistory] = useState<any[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>("Organic Inorganic");
    const [timeFilter, setTimeFilter] = useState<Date | null>(null);

    const db = FS_DB;

    const fetchHistory = async () => {
        const user = FB_AUTH.currentUser;
        if (user) {
            const historyRef = collection(db, `users/${user.uid}/history/`);
            const historyQuery = query(historyRef);

            try {
                const querySnapshot = await getDocs(historyQuery);
                const fetchedHistory = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setHistory(fetchedHistory);
                setFilteredHistory(fetchedHistory);
            } catch (error) {
                console.error("Error fetching documents: ", error);
            }
        }
    };

    const applyFilters = () => {
        let filtered = [...history];

        if (categoryFilter !== "Organic Inorganic") {
            filtered = filtered.filter((item) => item.category === categoryFilter);
        }

        if (timeFilter) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.time);
                return itemDate.toDateString() === timeFilter.toDateString();
            });
        }

        setFilteredHistory(filtered);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [categoryFilter, timeFilter]);

    return (
        <SafeAreaView style={{ marginTop: 20 }}>
            <StatusBar backgroundColor="#18341A" />
            <View>
                <Ionicons name="menu" size={20} left={20} onPress={() => navigation.openDrawer()} />
            </View>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Order History</Text>
                <Picker selectedValue={categoryFilter} onValueChange={(itemValue) => setCategoryFilter(itemValue)} style={{ marginVertical: 10 }}>
                    <Picker.Item label="All Categories" value="Organic Inorganic" key="all" />
                    <Picker.Item label="Organic" value="Organic" />
                    <Picker.Item label="Inorganic" value="Inorganic" />
                </Picker>
                <ScrollView>
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((item) => (
                            <View key={item.id} style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
                                <Text>Address: {item.address}</Text>
                                <Text>Weight: {item.weight} kg</Text>
                                <Text>Category: {item.category}</Text>
                                <Text>Time: {format(new Date(item.time), "MM/dd/yyyy HH:mm")}</Text>
                                <Text>Cost: Rp ..</Text>
                            </View>
                        ))
                    ) : (
                        <Text>No history found.</Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default HistoryScreen;

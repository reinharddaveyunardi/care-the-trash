import React, { useState, useEffect } from "react";
import { Button, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Progress from "react-native-progress";
import { color, menu, styles } from "../styling";
import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FB_AUTH, FS_DB } from "@/FirebaseConfig";

const db = FS_DB;

const MenuScreen = ({ navigation }: any) => {
    const [poin, setPoin] = useState(0);
    const [level, setLevel] = useState(1);
    const pointsForNextLevel = level * 300;
    const progress = poin / pointsForNextLevel;

    useEffect(() => {
        const fetchUserData = async () => {
            const user = FB_AUTH.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPoin(data.poin || 0);
                    setLevel(data.level || 1);
                }
            }
        };
        fetchUserData();
    }, []);

    const addPoints = async () => {
        const newPoints = poin + 100;
        let newLevel = level;
        let updatedPoints = poin;

        if (newPoints >= pointsForNextLevel && level < 10) {
            newLevel = level + 1;
            updatedPoints = newPoints - pointsForNextLevel;
        } else if (level >= 10) {
            updatedPoints = poin + 60;
        } else {
            updatedPoints = newPoints;
        }

        setLevel(newLevel);
        setPoin(updatedPoints);

        const user = FB_AUTH.currentUser;
        if (user) {
            await setDoc(
                doc(db, "users", user.uid),
                {
                    level: newLevel,
                    poin: updatedPoints,
                },
                { merge: true }
            );
        }
    };

    return (
        <SafeAreaView>
            <StatusBar backgroundColor="#18341A" />
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 40 }}>
                <View>
                    <Ionicons name="menu" size={20} left={20} onPress={() => navigation.openDrawer()} />
                </View>
                <View
                    style={{
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            marginTop: 20,
                            width: "90%",
                            height: 150,
                            flex: 1,
                            backgroundColor: "#18341A",
                            display: "flex",
                            borderRadius: 20,
                        }}
                    >
                        <Image source={require("@/assets/images/icon.png")} style={{ width: 150, height: 150 }} />
                        <View
                            style={{
                                position: "absolute",
                                top: 60,
                                left: 150,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <View>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate("poinModal", {
                                            progress: progress,
                                            level: level,
                                            poin: poin,
                                        })
                                    }
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Level {level}
                                    </Text>
                                    <Text style={{ color: "white", fontSize: 12 }}>Click here to redeem your points</Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Progress.Bar id="bar" progress={progress} width={100} borderColor={color.secColor} color={color.white} />
                                <TouchableOpacity onPress={addPoints} style={{ width: 30, height: 30 }}>
                                    <Text
                                        style={{
                                            color: "white",
                                            left: 4,
                                            fontSize: 23,
                                        }}
                                    >
                                        +
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MenuScreen;

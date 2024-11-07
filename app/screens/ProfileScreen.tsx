import React, {useState} from "react";
import {View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl} from "react-native";
import {FB_AUTH, FS_DB} from "@/FirebaseConfig";
import {signOut} from "firebase/auth";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusBar} from "react-native";
import {ColorPallet} from "@/constants/Colors";
import {FontAwesome6} from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import {doc, getDoc, setDoc} from "firebase/firestore";
function ProfileScreen({navigation}: any) {
    const [exp, setExp] = useState(0);
    const [point, setPoint] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [level, setLevel] = useState(1);
    const pointsForNextLevel = level * 300;
    const progress = exp / pointsForNextLevel;
    const [loading, setLoading] = useState(false);

    const db = FS_DB;
    const fetchUserData = async () => {
        const user = FB_AUTH.currentUser;
        if (user) {
            const docRef = doc(db, `users/${user.uid}/pointInfo/${user.uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setExp(data.exp || 0);
                setPoint(data.poin || 0);
                let updatedExp = data.exp;
                if (data.exp >= pointsForNextLevel && level < 10) {
                    setLevel(level + 1);
                    updatedExp = data.exp - pointsForNextLevel;
                    await setDoc(doc(db, `users/${user.uid}/pointInfo/${user.uid}`), {level: level, exp: updatedExp}, {merge: true});
                } else if (level == 10) {
                    setPoint(data.poin + data.exp);
                } else {
                    setLevel(data.level || 1);
                }
            }
        }
    };
    setTimeout(() => {
        fetchUserData();
    }, 100);

    const onRefresh = () => {
        setRefresh(true);
        fetchUserData();
        setTimeout(() => {
            setRefresh(false);
        }, 1000);
    };

    const SignOutHandler = async () => {
        await signOut(FB_AUTH);
        try {
            if (await AsyncStorage.getItem("keepLogin")) {
                await AsyncStorage.removeItem("keepLogin");
                console.log("removed from AsyncStorage");
            } else {
                navigation.replace("Login");
                console.log("Signed out");
            }
        } catch (error) {
            console.log(error);
        }
        navigation.navigate("Login");
        console.log("Signed out");
    };

    return (
        <SafeAreaView style={{flex: 1, zIndex: 1, backgroundColor: "white"}}>
            <StatusBar backgroundColor={ColorPallet.primary} />
            <View style={{position: "absolute", top: "5%", width: "100%", zIndex: 10}}>
                <View style={{flexDirection: "row", marginHorizontal: "4.5%", justifyContent: "space-between", alignItems: "center", height: 50}}>
                    <View>
                        <Ionicons name="menu" size={20} color={ColorPallet.white} onPress={() => navigation.openDrawer()} />
                    </View>
                    <View>
                        <Ionicons name="person" disabled size={20} color={ColorPallet.primary} onPress={() => navigation.navigate("Profile")} />
                    </View>
                </View>
            </View>
            <ScrollView style={{flex: 1, top: 20}} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}>
                <View style={{width: "100%", backgroundColor: ColorPallet.primary, height: 280}}>
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center", top: 30, gap: 5}}>
                        <Image source={require("@/assets/images/temp.png")} style={{width: 100, height: 100, borderRadius: 50}} />
                        <View style={{alignItems: "center", justifyContent: "center", marginTop: 10}}>
                            <Text style={{color: "white", fontSize: 20, fontWeight: "bold"}}>{FB_AUTH.currentUser?.displayName}</Text>
                            <View style={{flexDirection: "row", marginTop: 10, alignItems: "center", gap: 5}}>
                                <Text style={{color: "white"}}>{FB_AUTH.currentUser?.email}</Text>
                                <TouchableOpacity>
                                    <FontAwesome6 name="edit" color={ColorPallet.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                            <Text style={{color: ColorPallet.white}}>Status : </Text>
                            {FB_AUTH.currentUser?.emailVerified ? (
                                <View>
                                    <Text>Verified</Text>
                                    <FontAwesome6 name="circle-check" color="#0FA2D3" />
                                </View>
                            ) : (
                                <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}} activeOpacity={0.5}>
                                    <Text style={{color: ColorPallet.red}}>Not Verified</Text>
                                    <Ionicons name="close" size={20} color={ColorPallet.red} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
                <View style={{gap: 20, marginHorizontal: "2.3%", flex: 1, marginTop: 20}}>
                    <View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                            <Text style={{fontSize: 16, fontWeight: "bold"}}>Achievements</Text>
                            <TouchableOpacity style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <Text style={{fontSize: 16}}>See all</Text>
                                <Ionicons name="chevron-forward" size={20} color={ColorPallet.primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={{flexWrap: "wrap", flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between", marginTop: 5}}>
                            <View>
                                <View
                                    style={{
                                        height: 80,
                                        width: 80,
                                        backgroundColor: "rgba(0, 139, 65,0.5)",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 20,
                                    }}
                                >
                                    <Ionicons name="trash-bin" size={50} color={ColorPallet.primary} />
                                </View>
                                <Text style={{textAlign: "center"}}>Clean it up!</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize: 16, fontWeight: "bold"}}>General Information</Text>
                        <View style={{flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "space-around", marginTop: 5}}>
                            <View
                                style={{
                                    width: "49%",
                                    height: 80,
                                    elevation: 5,
                                    backgroundColor: ColorPallet.white,
                                    paddingLeft: 10,
                                    paddingTop: 10,
                                    gap: 5,
                                    borderRadius: 10,
                                }}
                            >
                                <Text>Point: {point}</Text>
                                <Text>Level: {level}</Text>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Progress.Bar progress={progress} width={100} color={ColorPallet.primary} />
                                    <Text>{Math.round(progress * 100)}%</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: "49%",
                                    height: 80,
                                    elevation: 5,
                                    backgroundColor: ColorPallet.white,
                                    paddingLeft: 10,
                                    gap: 5,
                                    justifyContent: "center",
                                    borderRadius: 10,
                                }}
                            >
                                <Text>Quest Completed: 0</Text>
                                <Text>Total Waste: 0 kg</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize: 16, fontWeight: "bold"}}>Account & Setting</Text>
                        <View style={{gap: 5}}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 5,
                                    marginTop: 5,
                                    borderBottomWidth: 1,
                                    paddingVertical: 10,
                                }}
                            >
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name="lock-closed-outline" size={20} color={ColorPallet.black} />
                                    <Text>Security</Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name="chevron-forward" size={20} color={ColorPallet.black} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 5,
                                    marginTop: 5,
                                    borderBottomWidth: 1,
                                    paddingVertical: 10,
                                }}
                            >
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Text>(Flag)</Text>
                                    <Text>Change Language</Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name="chevron-forward" size={20} color={ColorPallet.black} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 5,
                                    marginTop: 5,
                                    borderBottomWidth: 1,
                                    paddingVertical: 10,
                                }}
                            >
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name="accessibility-outline" size={20} color={ColorPallet.black} />
                                    <Text>Accessibility</Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name="chevron-forward" size={20} color={ColorPallet.black} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => SignOutHandler()}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: ColorPallet.white,
                            borderWidth: 1,
                            borderColor: ColorPallet.red,
                            marginTop: 20,
                            marginHorizontal: "2.5%",
                            padding: 10,
                            borderRadius: 10,
                            height: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            gap: 5,
                        }}
                    >
                        <Text style={{color: ColorPallet.red, fontWeight: "bold", fontSize: 16}}>Logout</Text>
                        <Ionicons name="log-out-outline" size={20} color={ColorPallet.red} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ProfileScreen;

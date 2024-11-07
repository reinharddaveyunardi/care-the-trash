import React, {useState, useEffect, useRef} from "react";
import {Image, StatusBar, Text, TouchableOpacity, View, RefreshControl, ScrollView, TouchableHighlight} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import * as Progress from "react-native-progress";
import {color} from "../styling";
import {FontAwesome6, Ionicons} from "@expo/vector-icons";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {FB_AUTH, FS_DB} from "@/FirebaseConfig";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {ColorPallet} from "@/constants/Colors";
import {redeemItems} from "@/data/Placehold";

const db = FS_DB;

const MenuScreen = ({navigation}: any) => {
    const [refresh, setRefresh] = useState(false);
    const [exp, setExp] = useState(0);
    const [isVisible, setVisible] = useState(false);
    const [level, setLevel] = useState(1);
    const [point, setPoint] = useState(0);
    const pointsForNextLevel = level * 300;
    const progress = exp / pointsForNextLevel;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetRefRedeemInfo = useRef<BottomSheet>(null);

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
    return (
        <SafeAreaView style={{flex: 1, zIndex: 1, backgroundColor: "white"}}>
            <StatusBar backgroundColor={ColorPallet.primary} />
            <View style={{position: "absolute", top: "5%", width: "100%", zIndex: 10}}>
                <View style={{flexDirection: "row", marginHorizontal: "4.5%", justifyContent: "space-between", alignItems: "center", height: 50}}>
                    <View>
                        <Ionicons name="menu" size={20} color={ColorPallet.white} onPress={() => navigation.openDrawer()} />
                    </View>
                    <View>
                        <Ionicons name="person" size={20} color={ColorPallet.white} onPress={() => navigation.navigate("Profile")} />
                    </View>
                </View>
            </View>
            <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}>
                <View>
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: ColorPallet.primary,
                            height: 280,
                            padding: 20,
                        }}
                    >
                        <View>
                            <Text style={{fontSize: 45, fontWeight: "bold", color: "rgba(255,255,255, 0.5)"}}>CARE</Text>
                            <Text style={{fontSize: 45, fontWeight: "bold", color: "rgba(255,255,255, 0.5)"}}>THE</Text>
                            <Text style={{fontSize: 45, fontWeight: "bold", color: "rgba(255,255,255, 0.5)"}}>TRASH</Text>
                        </View>
                        <View>
                            <Image source={require("@/assets/images/recycle.png")} style={{width: 150, height: 150, transform: [{rotate: "90deg"}]}} />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={{position: "absolute", top: 280, width: "100%"}}>
                <View style={{alignItems: "center", width: "100%", justifyContent: "center"}}>
                    <View
                        style={{
                            backgroundColor: ColorPallet.white,
                            alignItems: "center",
                            gap: 5,
                            width: "90%",
                            height: 80,
                            borderRadius: 20,
                            justifyContent: "space-around",
                            paddingHorizontal: "5%",
                            flexDirection: "row",
                            elevation: 5,
                        }}
                    >
                        <View>
                            <Image source={require("@/assets/images/icon.png")} style={{width: 30, height: 75}} />
                        </View>
                        <View style={{height: 50, backgroundColor: "rgba(0,0,0, 0.5)", width: 2}} />
                        <View style={{gap: 5}}>
                            <Text>
                                Point{point > 1 ? "s" : ""}: {point}
                            </Text>
                            <View>
                                <Text style={{textAlign: "center"}}>Level: {level}</Text>
                                <Progress.Bar progress={progress} width={70} unfilledColor={ColorPallet.white} color={ColorPallet.primary} />
                            </View>
                        </View>
                        <View style={{height: 50, backgroundColor: "rgba(0,0,0, 0.5)", width: 2}} />
                        <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
                            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5}}>
                                <Ionicons name="gift" size={30} color={ColorPallet.primary} />
                                <Text>Redeem</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{top: 20, alignItems: "center", flexDirection: "row", justifyContent: "space-around"}}>
                    <View>
                        <TouchableOpacity
                            style={{alignItems: "center", justifyContent: "center"}}
                            onPress={() => navigation.navigate("Organik", {wasteCategory: "Organic"})}
                        >
                            <View
                                style={{
                                    backgroundColor: "rgba(0, 139, 65, 0.6)",
                                    width: 55,
                                    height: 55,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                }}
                            >
                                <Ionicons name="leaf" size={30} color={ColorPallet.primary} />
                            </View>
                            <Text>Organic</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{alignItems: "center"}} onPress={() => navigation.navigate("Anorganik", {wasteCategory: "Inorganic"})}>
                        <View
                            style={{
                                backgroundColor: "rgba(30, 73, 179, 0.6)",
                                width: 55,
                                height: 55,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,
                            }}
                        >
                            <FontAwesome6 name="bottle-water" size={30} color={ColorPallet.blue} />
                        </View>
                        <Text>Inorganic</Text>
                    </TouchableOpacity>
                </View>
                <View style={{top: 40, marginLeft: "5.5%"}}>
                    <Text>Quest</Text>
                </View>
            </View>

            {/* Bottom Sheet */}

            <BottomSheet ref={bottomSheetRef} style={{backgroundColor: ColorPallet.white}} enablePanDownToClose index={-1} snapPoints={["10%", "40%", "60%"]}>
                <View style={{alignItems: "center"}}>
                    <Text>Your Level: {level}</Text>
                    <View>
                        <Text>
                            Your point{point > 1 ? "s" : ""}: {point}
                        </Text>
                    </View>
                </View>
                <BottomSheetScrollView style={{marginTop: "10%"}} showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: ColorPallet.white,
                            marginTop: 10,
                        }}
                    >
                        <View style={{gap: 20, paddingBottom: 20}}>
                            {redeemItems.map((item, index) => (
                                <RedeemCard
                                    key={index}
                                    title={item.name}
                                    category={item.cat}
                                    price={item.price}
                                    image={item.image}
                                    bottomSheetRefRedeemInfo={bottomSheetRefRedeemInfo}
                                />
                            ))}
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </SafeAreaView>
    );
};

function RedeemCard({navigation, title, category, price, bottomSheetRefRedeemInfo, image}: any) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    shadowOffset: {width: -1, height: 4},
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    backgroundColor: color.white,
                    elevation: 5,
                    gap: 8,
                    width: "80%",
                    padding: 10,
                    borderRadius: 10,
                }}
            >
                <Image source={image} style={{width: 100, height: 100, alignItems: "center"}} />
                <View>
                    <Text>Name: {title}</Text>
                    <Text>Category: {category}</Text>
                    <Text>Price: {price} points</Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: color.primaryColor,
                        padding: 10,
                        borderRadius: 10,
                        flexDirection: "row",
                        gap: 5,
                    }}
                    onPress={() => bottomSheetRefRedeemInfo.current?.expand()}
                >
                    <Text style={{color: color.white}}>Add to cart</Text>
                    <Ionicons name="cart-outline" size={20} color={color.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default MenuScreen;

import React, {useRef, useState} from "react";
import {View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl, Switch} from "react-native";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StatusBar} from "react-native";
import {ColorPallet} from "@/constants/Colors";
import {FontAwesome6} from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {getLevelExp, getProfile, isUserVerified, logout} from "@/services/api";
import {EmailVerificationHandler} from "@/services/handler";
import {Skeleton} from "moti/skeleton";

function ProfileScreen({navigation}: any) {
    const [refresh, setRefresh] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [userPoint, setUserPoint] = useState({exp: 0, level: 1, progress: 0, point: 0});
    const [userCred, setUserCred] = useState({name: "", email: "", uid: ""});
    const [showMessage, setShowMessage] = useState(false);
    const [isBiometric, setIsBiometric] = useState(false);
    const [loading, setLoading] = useState(false);
    const bottomSheetSecurityRef = useRef<BottomSheet>(null);
    const bottomSheetChangeLangRef = useRef<BottomSheet>(null);
    const bottomSheetAccessibilityRef = useRef<BottomSheet>(null);
    const biometricToggle = () => setIsBiometric((prev) => !prev);

    async function fetchData() {
        try {
            const {exp, level, progress, point} = await getLevelExp();
            const {name, email, uid} = await getProfile();
            setUserPoint({exp, level, progress, point});
            setUserCred({name, email, uid});
        } catch (error) {
            console.log(error);
        }
    }
    if (!fetched) {
        setTimeout(() => {
            fetchData();
            setLoading(false);
            setFetched(true);
        }, 1000);
    }
    const onRefresh = () => {
        setRefresh(true);
        setLoading(true);
        fetchData();
        setTimeout(() => {
            setRefresh(false);
            setLoading(false);
        }, 2000);
    };
    const SignOutHandler = async () => {
        try {
            logout();
        } catch (error) {
            console.log(error);
        }
        navigation.navigate("Login");
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
                        <Skeleton show={loading} width={100} height={100} radius={50} colorMode="light">
                            {!loading ? (
                                <Image source={{uri: require("@/assets/images/temp.png")}} style={{width: 100, height: 100, borderRadius: 50}} />
                            ) : null}
                        </Skeleton>
                        <View style={{alignItems: "center", justifyContent: "center", marginTop: 10}}>
                            <Skeleton show={loading} width={80} height={20} colorMode="light">
                                <Text style={{color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center", display: loading ? "none" : "flex"}}>
                                    {userCred.name !== undefined ? userCred.name : null}
                                </Text>
                            </Skeleton>
                            <View style={{flexDirection: "row", marginTop: 10, alignItems: "center", gap: 5}}>
                                <Skeleton show={loading} width={150} height={20} colorMode="light">
                                    {userCred !== undefined ? (
                                        <Text style={{color: "white", textAlign: "center", display: loading ? "none" : "flex"}}>{userCred.email}</Text>
                                    ) : null}
                                </Skeleton>
                                <TouchableOpacity>
                                    <FontAwesome6 name="edit" color={ColorPallet.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                            <Text style={{color: ColorPallet.white}}>Status : </Text>
                            {}
                            {isUserVerified ? (
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Text style={{color: ColorPallet.white, fontWeight: "bold"}}>Verified</Text>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={EmailVerificationHandler} style={{flexDirection: "row", alignItems: "center"}} activeOpacity={0.5}>
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
                                    elevation: 2,
                                    backgroundColor: ColorPallet.white,
                                    paddingHorizontal: 10,
                                    paddingTop: 10,
                                    gap: 5,
                                    borderRadius: 10,
                                }}
                            >
                                <Text>Point: {userPoint.point}</Text>
                                <Text>Level: {userPoint.level}</Text>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Progress.Bar progress={userPoint.progress} width={100} color={ColorPallet.primary} />
                                    <Text>{Math.round(userPoint.progress * 100)}%</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: "49%",
                                    height: 80,
                                    elevation: 2,
                                    backgroundColor: ColorPallet.white,
                                    paddingHorizontal: 10,
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
                                onPress={() => bottomSheetSecurityRef.current?.expand()}
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 5,
                                    marginTop: 5,
                                    elevation: 2,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    backgroundColor: ColorPallet.white,
                                    zIndex: 1,
                                    paddingVertical: 10,
                                }}
                            >
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name="lock-closed-outline" size={20} color={ColorPallet.primary} />
                                    <Text>Account Setting</Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name="chevron-forward" size={20} color={ColorPallet.primary} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => bottomSheetChangeLangRef.current?.expand()}
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 5,
                                    marginTop: 5,
                                    elevation: 2,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    backgroundColor: ColorPallet.white,
                                    zIndex: 1,
                                    paddingVertical: 10,
                                }}
                            >
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Text>(Flag)</Text>
                                    <Text>Change Language</Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name="chevron-forward" size={20} color={ColorPallet.primary} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => bottomSheetAccessibilityRef.current?.expand()}
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 5,
                                    marginTop: 5,
                                    elevation: 2,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    backgroundColor: ColorPallet.white,
                                    zIndex: 1,
                                    paddingVertical: 10,
                                }}
                            >
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name="accessibility-outline" size={20} color={ColorPallet.primary} />
                                    <Text>Accessibility</Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name="chevron-forward" size={20} color={ColorPallet.primary} />
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
            <BottomSheetSecurity bottomSheetRef={bottomSheetSecurityRef} biometricToggle={biometricToggle} isBiometric={isBiometric} />
            <BottomSheetChangeLang bottomSheetRef={bottomSheetChangeLangRef} />
            <BottomSheetAccessibility bottomSheetRef={bottomSheetAccessibilityRef} />
        </SafeAreaView>
    );
}

export default ProfileScreen;

function BottomSheetSecurity({bottomSheetRef, biometricToggle, isBiometric}: {bottomSheetRef: any; biometricToggle: any; isBiometric: any}) {
    return (
        <BottomSheet ref={bottomSheetRef} style={{flex: 1}} index={-1} enablePanDownToClose snapPoints={[100, 500]}>
            <BottomSheetScrollView style={{flex: 1}}>
                <Text style={{left: "5%"}}>Secure your account</Text>
                <View style={{paddingHorizontal: 20, paddingVertical: 20, flex: 1, height: "100%", gap: 20}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            elevation: 2,
                            height: 50,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            justifyContent: "space-between",
                            alignItems: "center",
                            zIndex: 1,
                            backgroundColor: ColorPallet.white,
                        }}
                    >
                        <View>
                            <Text>Change name</Text>
                        </View>
                        <View>
                            <Ionicons name="chevron-forward" size={20} color={ColorPallet.primary} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            elevation: 2,
                            height: 50,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            justifyContent: "space-between",
                            alignItems: "center",
                            zIndex: 1,
                            backgroundColor: ColorPallet.white,
                        }}
                    >
                        <View>
                            <Text>Change email</Text>
                        </View>
                        <View>
                            <Ionicons name="chevron-forward" size={20} color={ColorPallet.primary} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            elevation: 2,
                            height: 50,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            justifyContent: "space-between",
                            alignItems: "center",
                            zIndex: 1,
                            backgroundColor: ColorPallet.white,
                        }}
                    >
                        <View>
                            <Text>Change password</Text>
                        </View>
                        <View>
                            <Ionicons name="chevron-forward" size={20} color={ColorPallet.primary} />
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            elevation: 2,
                            height: 50,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            justifyContent: "space-between",
                            alignItems: "center",
                            zIndex: 1,
                            backgroundColor: ColorPallet.white,
                        }}
                    >
                        <View>
                            <Text>Add biometric </Text>
                        </View>
                        <View>
                            <Switch onValueChange={biometricToggle} value={isBiometric} thumbColor={isBiometric ? ColorPallet.primary : ColorPallet.white} />
                        </View>
                    </View>
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
}
function BottomSheetChangeLang({bottomSheetRef}: {bottomSheetRef: any}) {
    return (
        <BottomSheet ref={bottomSheetRef} index={-1} enablePanDownToClose snapPoints={[100, 500]}>
            <BottomSheetScrollView>
                <Text>bbb</Text>
            </BottomSheetScrollView>
        </BottomSheet>
    );
}
function BottomSheetAccessibility({bottomSheetRef}: {bottomSheetRef: any}) {
    return (
        <BottomSheet ref={bottomSheetRef} style={{flex: 1}} index={-1} enablePanDownToClose snapPoints={[100, 500]}>
            <BottomSheetScrollView style={{flex: 1}}>
                <Text style={{left: "5%"}}>Change your preferences</Text>
                <View style={{paddingHorizontal: 20, paddingVertical: 20, flex: 1, height: "100%", gap: 20}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            elevation: 2,
                            height: 50,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            justifyContent: "space-between",
                            alignItems: "center",
                            zIndex: 1,
                            backgroundColor: ColorPallet.white,
                        }}
                    >
                        <View>
                            <Text>Change email</Text>
                        </View>
                        <View>
                            <Ionicons name="chevron-forward" size={20} color={ColorPallet.primary} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            elevation: 2,
                            height: 50,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            justifyContent: "space-between",
                            alignItems: "center",
                            zIndex: 1,
                            backgroundColor: ColorPallet.white,
                        }}
                    >
                        <View>
                            <Text>Change password</Text>
                        </View>
                        <View>
                            <Ionicons name="chevron-forward" size={20} color={ColorPallet.primary} />
                        </View>
                    </TouchableOpacity>
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
}

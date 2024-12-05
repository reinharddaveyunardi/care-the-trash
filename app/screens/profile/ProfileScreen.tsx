import {useRef, useState} from "react";
import {View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl, Switch} from "react-native";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import {StatusBar} from "react-native";
import {ColorPallet} from "@/constants/Colors";
import {FontAwesome6} from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {getLevelExp, getProfile, isUserVerified, logout, uploadImage} from "@/services/api";
import {EmailVerificationHandler} from "@/services/handler";
import * as ImagePicker from "expo-image-picker";
import {FB_AUTH} from "@/services/FirebaseConfig";
import CustomAlert from "@/components/CustomAlert";
import i18n from "@/localization/i18n";
import {useTranslation} from "react-i18next";

function ProfileScreen({navigation}: any) {
    const [refresh, setRefresh] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [userPoint, setUserPoint] = useState({exp: 0, level: 1, progress: 0, point: 0});
    const [userCred, setUserCred] = useState({name: "", email: "", uid: "", imageUrl: ""});
    const [showMessage, setShowMessage] = useState(false);
    const [messageStatus, setMessageStatus] = useState("");
    const [isBiometric, setIsBiometric] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const bottomSheetSecurityRef = useRef<BottomSheet>(null);
    const bottomSheetChangeLangRef = useRef<BottomSheet>(null);
    const bottomSheetAccessibilityRef = useRef<BottomSheet>(null);
    const biometricToggle = () => setIsBiometric((prev) => !prev);
    const {t, i18n} = useTranslation();
    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        console.log(lang);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImage(imageUri);
            const file = {uri: imageUri, name: FB_AUTH.currentUser?.uid + ".jpg"};
            const url = await uploadImage(file);
            setUserCred({...userCred, imageUrl: url});
        }
    };
    const sendVerifLink = async () => {
        setShowMessage(false);
        try {
            await EmailVerificationHandler();
            setShowMessage(true);
            setMessageStatus("Verification link sent to your email.");
        } catch (error: any) {
            setShowMessage(true);
            setMessageStatus(error.message);
        }
    };

    async function fetchData() {
        try {
            const {exp, level, progress, point} = await getLevelExp();
            const {name, email, uid, imageUrl} = await getProfile();
            setUserPoint({exp, level, progress, point});
            setUserCred({name, email, uid, imageUrl});
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
        navigation.replace("Login");
    };
    return (
        <SafeAreaView style={{flex: 1, zIndex: 1, backgroundColor: "white"}}>
            <CustomAlert message={messageStatus} visible={showMessage} setVisible={() => setShowMessage(false)} />
            <StatusBar backgroundColor={ColorPallet.primary} />
            <View style={{position: "absolute", width: "100%", zIndex: 10, top: "4%"}}>
                <View style={{flexDirection: "row", marginHorizontal: "4.5%", justifyContent: "space-between", alignItems: "center", height: 50}}>
                    <View>
                        <Ionicons name="menu" size={20} color={ColorPallet.white} onPress={() => navigation.openDrawer()} />
                    </View>
                    <View>
                        <Ionicons name="person" disabled size={20} color={ColorPallet.primary} onPress={() => navigation.navigate("Profile")} />
                    </View>
                </View>
            </View>
            <ScrollView style={{flex: 1}} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}>
                <View style={{width: "100%", backgroundColor: ColorPallet.primary, height: 280}}>
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center", top: 30, gap: 5}}>
                        <TouchableOpacity onPress={pickImage}>
                            <Image
                                source={{
                                    uri:
                                        !userCred.imageUrl === undefined
                                            ? userCred.imageUrl
                                            : "https://firebasestorage.googleapis.com/v0/b/care-the-trash.appspot.com/o/users%2Ftemp.png?alt=media&token=6981c277-39ab-48b4-a499-5eac3101a3d3",
                                }}
                                style={{width: 100, height: 100, borderRadius: 50}}
                            />
                        </TouchableOpacity>
                        <View style={{alignItems: "center", justifyContent: "center", marginTop: 10}}>
                            <Text style={{color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center", display: loading ? "none" : "flex"}}>
                                {userCred.name !== undefined ? userCred.name : null}
                            </Text>
                            <View style={{flexDirection: "row", marginTop: 10, alignItems: "center", gap: 5}}>
                                <Text style={{color: "white", textAlign: "center", display: loading ? "none" : "flex"}}>{userCred.email}</Text>
                                <TouchableOpacity>
                                    <FontAwesome6 name="edit" color={ColorPallet.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                            <Text style={{color: ColorPallet.white}}>Status : </Text>
                            {isUserVerified ? (
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Text style={{color: ColorPallet.white, fontWeight: "bold"}}>{t("Profile.verified")}</Text>
                                </View>
                            ) : (
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Text style={{color: ColorPallet.red}}>{t("Profile.notVerified")}</Text>
                                    <Ionicons name="close" size={20} color={ColorPallet.red} />
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                <View style={{gap: 20, marginHorizontal: "2.3%", flex: 1, marginTop: 20}}>
                    <View>
                        <Text style={{fontSize: 16, fontWeight: "bold"}}>{t("Profile.general")}:</Text>
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
                                <Text>
                                    {t("Menu.point")}
                                    {i18n.language === "en" ? (userPoint.point > 0 ? "s" : null) : null}: {userPoint.point}
                                </Text>
                                <Text>
                                    {t("Menu.level")}: {userPoint.level}
                                </Text>
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
                                <Text>{t("Profile.qComplete")}: 0</Text>
                                <Text>{t("Profile.totalWaste")}: 0 kg</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize: 16, fontWeight: "bold"}}>{t("Profile.accountNSetting")}</Text>
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
                                    <Text>{t("Profile.accountSetting")}</Text>
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
                                    {i18n && i18n.language === "en" ? (
                                        <Image source={require(`@/assets/images/en.png`)} style={{width: 20, height: 20, borderWidth: 1}} borderRadius={50} />
                                    ) : (
                                        <Image source={require(`@/assets/images/id.png`)} style={{width: 20, height: 20, borderWidth: 1}} borderRadius={50} />
                                    )}
                                    <Text>{t("Profile.cLanguage")}</Text>
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
            <BottomSheetSecurity
                bottomSheetRef={bottomSheetSecurityRef}
                biometricToggle={biometricToggle}
                isBiometric={isBiometric}
                navigation={navigation}
                sendEmailVerif={sendVerifLink}
            />
            <BottomSheetChangeLang bottomSheetRef={bottomSheetChangeLangRef} handleChangeLanguage={handleLanguageChange} />
            <BottomSheetAccessibility bottomSheetRef={bottomSheetAccessibilityRef} />
        </SafeAreaView>
    );
}

export default ProfileScreen;

function BottomSheetSecurity({
    bottomSheetRef,
    biometricToggle,
    isBiometric,
    navigation,
    sendEmailVerif,
}: {
    bottomSheetRef: any;
    biometricToggle: any;
    isBiometric: any;
    navigation: any;
    sendEmailVerif: any;
}) {
    const {t} = useTranslation();
    return (
        <BottomSheet ref={bottomSheetRef} style={{flex: 1}} index={-1} enablePanDownToClose snapPoints={[100, 500]}>
            <BottomSheetScrollView style={{flex: 1}}>
                <Text style={{left: "5%"}}>Secure your account</Text>
                <View style={{paddingHorizontal: 20, paddingVertical: 20, flex: 1, height: "100%", gap: 20}}>
                    {FB_AUTH.currentUser?.emailVerified ? null : (
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
                                backgroundColor: ColorPallet.warning,
                            }}
                        >
                            <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                <Ionicons name="alert" size={20} color={ColorPallet.red} />
                                <Text>{t("Profile.yourEmailNotVerified")}</Text>
                            </View>
                            <TouchableOpacity
                                style={{borderColor: "rgba(0,0,0,0.2)", borderWidth: 1, padding: 5, borderRadius: 5}}
                                onPress={() => sendEmailVerif()}
                            >
                                <Text>Verify now!</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
                        onPress={() => navigation.navigate("Reset")}
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
function BottomSheetChangeLang({bottomSheetRef, handleChangeLanguage}: {bottomSheetRef: any; handleChangeLanguage: any}) {
    return (
        <BottomSheet ref={bottomSheetRef} index={-1} enablePanDownToClose snapPoints={[100, 500]}>
            <BottomSheetScrollView style={{flex: 1, padding: 20}}>
                <View style={{gap: 20}}>
                    <TouchableOpacity onPress={() => handleChangeLanguage("en")} activeOpacity={0.9}>
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 10}}>
                            <Image source={require(`@/assets/images/en.png`)} style={{width: 20, height: 20, borderWidth: 1}} borderRadius={50} />
                            <View
                                style={[
                                    {width: "90%", height: 50, justifyContent: "center"},
                                    i18n.language === "en"
                                        ? {backgroundColor: ColorPallet.primary, borderRadius: 10, paddingHorizontal: 10, elevation: 2}
                                        : {backgroundColor: ColorPallet.white, borderRadius: 10, paddingHorizontal: 10, elevation: 2},
                                ]}
                            >
                                <Text style={[i18n.language === "en" && {color: ColorPallet.white}]}>English</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleChangeLanguage("id")} activeOpacity={0.6}>
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 10}}>
                            <Image source={require(`@/assets/images/id.png`)} style={{width: 20, height: 20, borderWidth: 1}} borderRadius={50} />
                            <View
                                style={[
                                    {width: "90%", height: 50, justifyContent: "center"},
                                    i18n.language === "id"
                                        ? {backgroundColor: ColorPallet.primary, borderRadius: 10, paddingHorizontal: 10}
                                        : {backgroundColor: ColorPallet.white, borderRadius: 10, paddingHorizontal: 10, elevation: 2},
                                ]}
                            >
                                <Text style={i18n.language === "id" ? {color: ColorPallet.white} : {color: ColorPallet.black}}>Indonesia</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
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

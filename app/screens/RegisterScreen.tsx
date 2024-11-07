import React, {useState} from "react";
import {View, Image, TextInput, Text, TouchableOpacity, StatusBar, ActivityIndicator, KeyboardAvoidingView, ImageBackground} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {FB_AUTH, FS_DB} from "@/FirebaseConfig";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {ColorPallet} from "@/constants/Colors";

const RegisterScreen = ({navigation}: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FB_AUTH;
    const db = FS_DB;

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(response.user, {displayName: name});

            await setDoc(doc(db, "users", response.user.uid), {
                name: name,
                email: email,
                uid: response.user.uid,
            });

            navigation.replace("Login");
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView>
            <StatusBar backgroundColor={ColorPallet.primary} />
            <KeyboardAvoidingView behavior="padding">
                <ImageBackground source={require("@/assets/images/register.png")} style={{width: "100%", height: "100%"}} blurRadius={1.5}>
                    <View style={{height: "100%", justifyContent: "center"}}>
                        <View style={{justifyContent: "space-between", alignItems: "center", height: "100%", gap: 16}}>
                            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                <Text style={{fontSize: 32, fontWeight: "bold", color: ColorPallet.white}}>Register</Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    width: "95%",
                                    borderRadius: 10,
                                    alignItems: "center",
                                    justifyContent: "center",

                                    gap: 8,
                                    margin: 16,
                                }}
                            >
                                <View style={{width: "100%", alignItems: "center", gap: 8}}>
                                    <TextInput
                                        textContentType="name"
                                        keyboardType="default"
                                        placeholderTextColor={ColorPallet.white}
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: ColorPallet.white,
                                            padding: 8,
                                            width: "85%",
                                            color: ColorPallet.white,
                                            backgroundColor: "rgba(255,255,255, 0.3)",
                                        }}
                                        cursorColor={ColorPallet.primary}
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChangeText={(text) => setName(text)}
                                        autoCapitalize="none"
                                        autoComplete="off"
                                    />
                                    <TextInput
                                        textContentType="emailAddress"
                                        keyboardType="email-address"
                                        placeholderTextColor={ColorPallet.white}
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: ColorPallet.white,
                                            padding: 8,
                                            width: "85%",
                                            color: ColorPallet.white,
                                            backgroundColor: "rgba(255,255,255, 0.3)",
                                        }}
                                        cursorColor={ColorPallet.primary}
                                        placeholder="Enter your email"
                                        value={email}
                                        onChangeText={(text) => setEmail(text)}
                                        autoCapitalize="none"
                                        autoComplete="off"
                                    />
                                    <TextInput
                                        textContentType="password"
                                        value={password}
                                        autoCapitalize="none"
                                        keyboardType="default"
                                        cursorColor={ColorPallet.primary}
                                        onChangeText={(text) => setPassword(text)}
                                        placeholderTextColor={ColorPallet.white}
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: ColorPallet.white,
                                            padding: 8,
                                            width: "85%",
                                            color: ColorPallet.white,
                                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                                        }}
                                        placeholder="Enter your password"
                                        secureTextEntry={true}
                                        autoComplete="off"
                                    />
                                </View>
                                {loading ? (
                                    <ActivityIndicator size={"large"} color={"#18341A"} />
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{height: 45, backgroundColor: ColorPallet.primary, width: "85%", borderRadius: 10}}
                                            onPress={signUp}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: "center",
                                                    flex: 1,
                                                    textAlignVertical: "center",
                                                    fontSize: 20,
                                                    color: "white",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Register
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                                    <Text style={{color: ColorPallet.white}}>Already have an account?</Text>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.replace("Login")}>
                                        <Text
                                            style={{
                                                color: ColorPallet.white,
                                            }}
                                        >
                                            Login
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterScreen;

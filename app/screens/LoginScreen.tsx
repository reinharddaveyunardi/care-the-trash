import React, {useEffect, useState} from "react";
import {View, TextInput, Text, TouchableOpacity, StatusBar, ActivityIndicator, KeyboardAvoidingView, ImageBackground, Switch} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {FB_AUTH} from "@/FirebaseConfig";
import {signInWithEmailAndPassword} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ColorPallet} from "@/constants/Colors";
import {Ionicons} from "@expo/vector-icons";

type UserCred = {
    email: string;
    password: string;
};
const storeUserCred = async (userCred: UserCred): Promise<void> => {
    try {
        await AsyncStorage.setItem("userEmail", userCred.email);
        await AsyncStorage.setItem("userPassword", userCred.password);
        console.log("User credentials stored successfully");
    } catch (error) {
        console.log("Failed to store user credentials", error);
    }
};
const getFirebaseErrorMessage = (error: any) => {
    let errMess = null;

    switch (error.code) {
        case "auth/user-not-found":
            errMess = "User not found";
            break;
        case "auth/wrong-password":
            errMess = "Wrong password";
            break;
        case "auth/email-already-in-use":
            errMess = "Email already in use";
            break;
        case "auth/invalid-email":
            errMess = "Invalid email";
            break;
        case "auth/invalid-password":
            errMess = "Invalid password";
            break;
        default:
            errMess = `Something went wrong: ${error.message}`;
    }

    return errMess;
};

const LoginScreen = ({navigation}: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRemembered, setIsRemembered] = useState(false);
    const rememberToggle = () => setIsRemembered((previous) => !previous);
    const auth = FB_AUTH;

    const signIn = async () => {
        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (isRemembered) {
                await AsyncStorage.setItem("keepLogin", "true");
                await AsyncStorage.setItem("userData", JSON.stringify({email, password}));
                console.log("Stored your data");
            }
            navigation.replace("Inside");
        } catch (error: any) {
            const errorMessage = getFirebaseErrorMessage(error);
            setError(errorMessage);
            console.log(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        try {
            const getData = async () => {
                const userData = await AsyncStorage.getItem("userData");
                if (userData !== null) {
                    const parsedUserData = JSON.parse(userData);
                    if (parsedUserData?.email && parsedUserData?.password) {
                        setEmail(parsedUserData?.email);
                        setPassword(parsedUserData?.password);
                    }
                }
            };
            getData();
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <SafeAreaView>
            <StatusBar backgroundColor="#18341A" />
            <KeyboardAvoidingView behavior="padding">
                <ImageBackground source={require("@/assets/images/bg.png")} style={{width: "100%", height: "100%"}} blurRadius={2.5}>
                    <View style={{height: "100%", justifyContent: "center"}}>
                        <View style={{justifyContent: "space-between", alignItems: "center", height: "100%", gap: 16}}>
                            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                <Text style={{fontSize: 32, fontWeight: "bold", color: ColorPallet.white}}>Login</Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    width: "100%",
                                    borderRadius: 10,
                                    justifyContent: "center",
                                    gap: 8,
                                    margin: 16,
                                }}
                            >
                                <View style={{width: "100%", gap: 8, alignItems: "center"}}>
                                    <View style={{width: "85%", gap: 8}}>
                                        <View style={{width: "100%", gap: 8, alignItems: "center"}}>
                                            <TextInput
                                                value={email}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                                cursorColor={ColorPallet.primary}
                                                onChangeText={(text) => setEmail(text)}
                                                placeholderTextColor={ColorPallet.white}
                                                style={{
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: ColorPallet.white,
                                                    padding: 8,
                                                    width: "100%",
                                                    color: ColorPallet.white,
                                                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                                                }}
                                                placeholder="Enter your email"
                                                autoComplete="off"
                                            />
                                        </View>
                                    </View>
                                    {showPassword ? (
                                        <View style={{width: "85%", gap: 8}}>
                                            <View style={{width: "100%", alignItems: "flex-end"}}>
                                                <TouchableOpacity onPress={() => setShowPassword(false)}>
                                                    <Ionicons name="eye-off-outline" size={24} color={ColorPallet.white} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{width: "100%", gap: 8, alignItems: "center"}}>
                                                <TextInput
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
                                                        width: "100%",
                                                        color: ColorPallet.white,
                                                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                                                    }}
                                                    placeholder="Enter your password"
                                                    autoComplete="off"
                                                />
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={{width: "85%", gap: 8}}>
                                            <View style={{width: "100%", alignItems: "flex-end"}}>
                                                <TouchableOpacity onPress={() => setShowPassword(true)}>
                                                    <Ionicons name="eye-outline" size={24} color={ColorPallet.white} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{width: "100%", gap: 8, alignItems: "center"}}>
                                                <TextInput
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
                                                        width: "100%",
                                                        color: ColorPallet.white,
                                                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                                                    }}
                                                    secureTextEntry
                                                    placeholder="Enter your password"
                                                    autoComplete="off"
                                                />
                                            </View>
                                        </View>
                                    )}
                                </View>
                                <View style={{width: "100%", justifyContent: "center", alignItems: "center", gap: 3}}>
                                    <View style={{width: "85%"}}>
                                        <View style={{flexDirection: "row", gap: 2, width: "100%"}}>
                                            <Text style={{color: ColorPallet.white}}>Forgot password?</Text>
                                            <TouchableOpacity activeOpacity={1}>
                                                <Text style={{color: ColorPallet.white}}>Reset now!</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{width: "85%", flexDirection: "row", gap: 10, alignItems: "center"}}>
                                        <Switch onValueChange={rememberToggle} value={isRemembered} />
                                        <Text style={{color: ColorPallet.white}}>Remember Me</Text>
                                    </View>
                                    <View style={{width: "100%", alignItems: "center", gap: 10}}>
                                        {loading ? (
                                            <ActivityIndicator size={"large"} color={ColorPallet.white} />
                                        ) : (
                                            <>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    style={{height: 45, backgroundColor: ColorPallet.primary, width: "85%", borderRadius: 10}}
                                                    onPress={signIn}
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
                                                        Login
                                                    </Text>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                        <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                                            <Text style={{color: ColorPallet.white}}>Don't have an account?</Text>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.replace("Register")}>
                                                <Text
                                                    style={{
                                                        color: ColorPallet.white,
                                                    }}
                                                >
                                                    Register
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;

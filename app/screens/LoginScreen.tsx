import React, { useState } from "react";
import { View, Image, TextInput, Text, TouchableOpacity, StatusBar, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonStylesPresets, styles } from "../styling";
import { FB_AUTH } from "@/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = FB_AUTH;

    const signIn = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            await storeUserCred({ email, password });
            navigation.replace("Inside");
        } catch (error: any) {
            const errorMessage = getFirebaseErrorMessage(error);
            setError(errorMessage);
            console.log(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView>
            <StatusBar backgroundColor="#18341A" />
            <KeyboardAvoidingView behavior="padding">
                <View style={{ justifyContent: "space-around", alignItems: "center", height: 450, gap: 16 }}>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Image source={require("@/assets/images/icon.png")} style={styles.imageMedium} />
                        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Login</Text>
                    </View>
                    <View style={{ flex: 1, width: "100%", alignItems: "center", gap: 8 }}>
                        <View style={{ width: "100%", alignItems: "center", gap: 8 }}>
                            <TextInput
                                textContentType="emailAddress"
                                keyboardType="email-address"
                                style={{ borderWidth: 1, padding: 8, width: "80%" }}
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
                                onChangeText={(text) => setPassword(text)}
                                style={{ borderWidth: 1, padding: 8, width: "80%" }}
                                placeholder="Enter your password"
                                secureTextEntry={true}
                                autoComplete="off"
                            />
                            <Text style={{ textAlign: "left" }}>Forgot password? Reset now! (Not Available)</Text>
                        </View>
                        {loading ? (
                            <ActivityIndicator size={"large"} color={"#18341A"} />
                        ) : (
                            <>
                                <TouchableOpacity style={ButtonStylesPresets.filledBtn} onPress={signIn}>
                                    <Text style={{ textAlign: "center", flex: 1, textAlignVertical: "center", fontSize: 20, color: "white", fontWeight: "bold" }}>Login</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <TouchableOpacity style={ButtonStylesPresets.borderedBtn} onPress={() => navigation.push("Register")}>
                            <Text style={{ textAlign: "center", flex: 1, textAlignVertical: "center", fontSize: 20, color: "#56876D", fontWeight: "bold" }}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;

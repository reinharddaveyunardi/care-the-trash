import React, { useState } from "react";
import { View, Image, TextInput, Text, TouchableOpacity, StatusBar, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonStylesPresets, styles } from "../styling";
import { FB_AUTH } from "@/FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FB_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView>
            <StatusBar backgroundColor="#18341A" />
            <KeyboardAvoidingView behavior="padding">
                <View
                    style={{
                        justifyContent: "space-around",
                        alignItems: "center",
                        height: 450,
                        gap: 16,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                        }}
                    >
                        <Image source={require("@/assets/images/icon.png")} style={styles.imageMedium} />
                        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Login</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            width: "100%",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <View
                            style={{
                                width: "100%",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <TextInput
                                textContentType="emailAddress"
                                keyboardType="email-address"
                                style={{
                                    borderWidth: 1,
                                    padding: 8,
                                    width: "80%",
                                }}
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
                                style={{
                                    borderWidth: 1,
                                    padding: 8,
                                    width: "80%",
                                }}
                                placeholder="Create your password"
                                secureTextEntry={true}
                                autoComplete="off"
                            />
                            <Text style={{ textAlign: "left" }}>Forgot password? Reset now!(Not Available)</Text>
                        </View>
                        {loading ? (
                            <ActivityIndicator size={"large"} color={"#18341A"} />
                        ) : (
                            <>
                                <TouchableOpacity style={ButtonStylesPresets.filledBtn} onPress={() => signIn()}>
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            display: "flex",
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
                        <TouchableOpacity style={ButtonStylesPresets.borderedBtn} onPress={() => navigation.push("Register")}>
                            <Text
                                style={{
                                    textAlign: "center",
                                    display: "flex",
                                    flex: 1,
                                    textAlignVertical: "center",
                                    fontSize: 20,
                                    color: "#56876D",
                                    fontWeight: "bold",
                                }}
                            >
                                Register
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;

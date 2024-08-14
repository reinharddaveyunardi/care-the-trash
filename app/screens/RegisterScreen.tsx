import React, { useState } from "react";
import { View, Image, TextInput, Text, TouchableOpacity, StatusBar, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonStylesPresets, styles } from "../styling";
import { FB_AUTH, FS_DB } from "@/FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const RegisterScreen = ({ navigation }: any) => {
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

            await updateProfile(response.user, { displayName: name });

            await setDoc(doc(db, "users", response.user.uid), {
                name: name,
                email: email,
                uid: response.user.uid,
            });
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
                        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Register</Text>
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
                                textContentType="name"
                                keyboardType="default"
                                style={{
                                    borderWidth: 1,
                                    padding: 8,
                                    width: "80%",
                                }}
                                placeholder="Enter your full name"
                                value={name}
                                onChangeText={(text) => setName(text)}
                                autoCapitalize="none"
                                autoComplete="off"
                            />
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
                            />
                            <Text style={{ textAlign: "left" }}>Forgot password? Reset now!(Not Available)</Text>
                        </View>
                        {loading ? (
                            <ActivityIndicator size={"large"} color={"#18341A"} />
                        ) : (
                            <>
                                <TouchableOpacity style={ButtonStylesPresets.filledBtn} onPress={() => signUp()}>
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
                                        Register
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <TouchableOpacity style={ButtonStylesPresets.borderedBtn} onPress={() => navigation.push("Login")}>
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
                                Log in
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterScreen;

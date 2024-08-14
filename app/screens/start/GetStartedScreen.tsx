import React from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { styles, ButtonStylesPresets } from "@/app/styling/index";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function GetStartedScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.centeringItems}>
            <StatusBar backgroundColor="#18341A" />
            <View style={styles.container}>
                <View>
                    <Image
                        style={styles.imageLarge}
                        source={require("@/assets/images/icon.png")}
                    />
                </View>
                <Text style={styles.fontSemiBold}>
                    Welcome to Care The Trash, let's take care of the
                    environment!
                </Text>

                <View
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                    <TouchableOpacity
                        style={ButtonStylesPresets.filledBtn}
                        onPress={() => navigation.push("Login")}
                    >
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
                            Get Started
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                        }}
                    >
                        <Text>Learn more about</Text>

                        <Text
                            style={{ textDecorationLine: "underline" }}
                            onPress={() =>
                                Linking.openURL(
                                    "https://www.carethetrash.my.id"
                                )
                            }
                        >
                            Care The Trash
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

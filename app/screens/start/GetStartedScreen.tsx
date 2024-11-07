import React from "react";
import {Image, Linking, Text, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import OnBoard from "react-native-onboarding-swiper";
import {Ionicons} from "@expo/vector-icons";
import {ColorPallet} from "@/constants/Colors";

export default function GetStartedScreen({navigation}: any) {
    return (
        <View style={{flex: 1}}>
            <StatusBar backgroundColor={ColorPallet.primary} />
            <OnBoard
                pages={[
                    {
                        backgroundColor: ColorPallet.white,
                        image: <Image source={require("@/assets/images/icon.png")} style={{width: 300, height: 300}} />,
                        title: <Text style={{fontWeight: "bold", fontSize: 32, color: ColorPallet.primary}}>Care the Trash</Text>,
                        subtitle: <Text>Set, Wait, Healthy Earth</Text>,
                    },
                    {
                        backgroundColor: ColorPallet.white,
                        image: <Image source={require("@/assets/images/set.png")} style={{width: 300, height: 240}} />,
                        title: <Text style={{fontWeight: "bold", fontSize: 32, color: ColorPallet.primary}}>Set</Text>,
                        subtitle: <Text>Set your daily waste</Text>,
                    },
                    {
                        backgroundColor: ColorPallet.white,
                        image: <Image source={require("@/assets/images/wait.png")} style={{width: 400, height: 200}} />,
                        title: <Text style={{fontWeight: "bold", fontSize: 32, color: ColorPallet.primary}}>Wait</Text>,
                        subtitle: <Text>Your trash is sent to be recycled </Text>,
                    },
                    {
                        backgroundColor: ColorPallet.white,
                        image: <Image source={require("@/assets/images/earth.png")} style={{width: 300, height: 300}} />,
                        title: <Text style={{fontWeight: "bold", fontSize: 32, color: ColorPallet.primary}}>Healthy Earth</Text>,
                        subtitle: <Text>Make your planet healthy!</Text>,
                    },
                    {
                        backgroundColor: ColorPallet.white,
                        image: <Image source={require("@/assets/images/ready.png")} style={{width: 300, height: 300}} />,
                        title: <Text style={{fontWeight: "bold", fontSize: 32, color: ColorPallet.primary}}>Ready?</Text>,
                        subtitle: (
                            <View style={{flexDirection: "row", marginTop: "20%", gap: 5}}>
                                <Text>Still in doubt?</Text>
                                <Text onPress={() => Linking.openURL("https://carethetrash.my.id")} style={{borderBottomWidth: 1}}>
                                    Care The Trash
                                </Text>
                            </View>
                        ),
                    },
                ]}
                bottomBarColor="#fff"
                transitionAnimationDuration={500}
                DotComponent={({selected}) => (
                    <View
                        style={{
                            width: 25,
                            height: 8,
                            borderRadius: 5,
                            marginHorizontal: 3,
                            backgroundColor: selected ? ColorPallet.primary : "rgba(0, 0, 0, 0.3)",
                        }}
                    />
                )}
                nextLabel={<Ionicons name="chevron-forward" style={{right: "10%"}} size={24} color={ColorPallet.primary} />}
                skipLabel={<Text style={{color: ColorPallet.primary, right: "10%"}}>Skip</Text>}
                DoneButtonComponent={() => (
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={{color: ColorPallet.primary, right: "20%"}}>Go</Text>
                    </TouchableOpacity>
                )}
                onSkip={() => navigation.navigate("Login")}
            />
        </View>
    );
}

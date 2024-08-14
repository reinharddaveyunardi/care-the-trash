import { FB_AUTH } from "@/FirebaseConfig";
import { NavgiationsProps } from "@/interface";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { Button, Text, View } from "react-native";

function SettingsScreen({ navigation }: NavgiationsProps) {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View>
                <Text>{FB_AUTH.currentUser?.email}</Text>
                <Text>{FB_AUTH.currentUser?.displayName}</Text>
            </View>
            <Button onPress={() => FB_AUTH.signOut()} title="Logout" />
        </View>
    );
}

export default SettingsScreen;

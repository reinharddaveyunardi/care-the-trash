import { FB_AUTH } from "@/FirebaseConfig";
import React from "react";
import { View, Text, Button } from "react-native";

function ProfileScreen() {
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

export default ProfileScreen;

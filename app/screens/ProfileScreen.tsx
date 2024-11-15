import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FB_AUTH, FB_STORAGE } from "@/FirebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import Ionicons from "@expo/vector-icons/build/Ionicons";

function ProfileScreen({ navigation }: any) {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (FB_AUTH.currentUser?.photoURL) {
                setProfilePicture(FB_AUTH.currentUser.photoURL);
            }
        };

        fetchProfilePicture();
    }, []);

    const handleUpload = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            console.error("Permission to access media library was denied");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const fileUri = result.assets[0].uri;
            const userId = FB_AUTH.currentUser?.uid;
            if (!fileUri || !userId) {
                console.error("Image URI or User ID is undefined");
                return;
            }

            const fileName = `${userId}_profile.jpg`;
            const fileRef = ref(FB_STORAGE, `profile_pictures/${fileName}`);

            setLoading(true);
            try {
                if (profilePicture) {
                    const oldFileName = profilePicture.split("/").pop();
                    const oldFileRef = ref(FB_STORAGE, `profile_pictures/${oldFileName}`);
                    await deleteObject(oldFileRef);
                }
                const response = await fetch(fileUri);
                const blob = await response.blob();
                await uploadBytes(fileRef, blob);
                const url = await getDownloadURL(fileRef);
                await updateProfile(FB_AUTH.currentUser!, {
                    photoURL: url,
                });

                setProfilePicture(url);
                setLoading(false);
            } catch (error) {
                console.error("Failed to upload profile picture", error);
                setLoading(false);
            }
        } else {
            console.error("No image selected or result.assets is undefined");
        }
    };

    return (
        <SafeAreaView style={{ marginTop: 80 }}>
            <View>
                <Ionicons name="menu" size={20} left={20} onPress={() => navigation.openDrawer()} />
            </View>
            <View>
                <View style={styles.profileInfo}>
                    <TouchableOpacity onPress={handleUpload}>
                        {profilePicture ? <Image source={{ uri: profilePicture }} style={styles.profileImage} /> : <Image source={require("@/assets/images/temp.png")} style={styles.profileImage} />}
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text>{FB_AUTH.currentUser?.displayName}</Text>
                    <Text>{FB_AUTH.currentUser?.email}</Text>
                </View>
                <Button onPress={() => FB_AUTH.signOut()} title="Logout" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    profileInfo: {
        alignItems: "center",
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default ProfileScreen;

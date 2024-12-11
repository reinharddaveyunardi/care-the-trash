import {SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {ColorPallet} from "@/constants/Colors";
import {ResetPassword} from "@/services/handler";
import {useEffect, useState} from "react";
import CustomAlert from "@/components/CustomAlert";

export default function ChangePassword({navigation}: any) {
    const [email, setEmail] = useState("");
    const [messageStatus, setMessageStatus] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [count, setCount] = useState(10);
    useEffect(() => {
        const timer = setTimeout(() => {
            setCount(count - 1);
            if (count === 0) {
                setIsSent(false);
                setCount(0);
                navigation.replace("Profile");
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [count]);
    const sendResetLink = () => {
        setShowMessage(false);
        try {
            ResetPassword(email);
            setShowMessage(true);
            setIsSent(true);
            setMessageStatus("Password reset link sent to your email.");
        } catch (error: any) {
            setMessageStatus(error.message);
            setShowMessage(true);
        }
    };
    return (
        <SafeAreaView>
            <CustomAlert message={messageStatus} visible={showMessage} onClose={() => setShowMessage(false)} />
            <View style={{paddingHorizontal: 20, flexDirection: "row", paddingVertical: 20, gap: 10, alignItems: "center"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: "bold"}}>Change Password</Text>
            </View>
            <View style={{alignItems: "center"}}>
                <View
                    style={{
                        width: "90%",
                        paddingHorizontal: 20,
                        height: 50,
                        borderRadius: 10,
                        justifyContent: "center",
                        elevation: 2,
                        zIndex: 1,
                        backgroundColor: ColorPallet.white,
                    }}
                >
                    <TextInput placeholder="Email" value={email} onChangeText={(email) => setEmail(email)} />
                </View>
            </View>
            <View style={{alignItems: "center", marginTop: 20}}>
                <TouchableOpacity
                    style={{
                        width: "90%",
                        paddingHorizontal: 20,
                        height: 50,
                        borderRadius: 10,
                        justifyContent: "center",
                        elevation: 2,
                        zIndex: 1,
                        backgroundColor: ColorPallet.primary,
                    }}
                    onPress={() => sendResetLink()}
                >
                    <Text style={{color: ColorPallet.white, textAlign: "center", fontSize: 16, fontWeight: "bold"}}>
                        {isSent ? `Navigating you back in ${count} seconds` : "Reset Password"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

import {sendEmailVerification, sendPasswordResetEmail} from "firebase/auth";
import {FB_AUTH} from "./FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import {ValidationMessages} from "@/constants/messages";

const auth = FB_AUTH;
const user = auth.currentUser;

// Mengirim link verifikasi email
export const EmailVerificationHandler = async () => {
    if (user) {
        console.log(user);
        await sendEmailVerification(user).then(() => {
            throw new Error(ValidationMessages.sendEmailVerif);
        });
    }
};

export const ResetPassword = async (email: string) => {
    if (email) {
        await sendPasswordResetEmail(auth, email).then(() => {
            throw new Error(ValidationMessages.sendEmailVerif);
        });
    }
};
// Refresh handler
export const refreshHandler = ({refreshContent}: any) => {
    setTimeout(() => {
        refreshContent();
    }, 2000);
};

const pickImageHandler = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });
    return new Promise((resolve, reject) => {
        if (!result.canceled) {
            resolve(result.assets[0].uri);
        } else {
            reject();
        }
    });
};

import {sendEmailVerification} from "firebase/auth";
import {FB_AUTH} from "./FirebaseConfig";
import {ValidationMessages} from "@/constants/messages";

const auth = FB_AUTH;
const user = auth.currentUser;

// Mengirim link verifikasi email
export const EmailVerificationHandler = async () => {
    if (user) {
        await sendEmailVerification(user).then(() => {
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

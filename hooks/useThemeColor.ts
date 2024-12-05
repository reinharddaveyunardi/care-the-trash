import {Colors} from "@/constants/Colors";
import {FB_AUTH, FS_DB} from "@/services/FirebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import {useEffect, useState} from "react";

export function useThemeColor(props: {light?: string; dark?: string}) {
    const [isDark, setIsDark] = useState(false);

    const fetchUserSetting = async () => {
        const db = FS_DB;
        const user = FB_AUTH.currentUser;

        if (user) {
            const docRef = doc(db, `users/${user.uid}/setting/${user.uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setIsDark(data.mode || false);
            }
        }
    };

    useEffect(() => {
        fetchUserSetting();
    }, []);

    const theme = isDark ? "dark" : "light";
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme];
    }
}

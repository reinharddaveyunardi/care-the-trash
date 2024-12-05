import {FB_AUTH, FB_STORAGE, FS_DB} from "@/services/FirebaseConfig";
import {loginProps, OrderProps, registerProps} from "@/interface";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile} from "firebase/auth";
import {ValidationMessages} from "@/constants/messages";
import {setDoc, doc, getDoc, collection, getDocs, increment, updateDoc} from "firebase/firestore";
import {removeItemFromAsyncStorage, saveItemToAsyncStorage} from "./AsyncStorage";
import {expObtained, generateRandomUid, pointObtained} from "@/utils";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

// deklarasi / define auth dan db
const auth = FB_AUTH;
const db = FS_DB;
export const thisUser = auth.currentUser;
export const isUserVerified = thisUser?.emailVerified;

// Login
export const login = async ({email, password, isRemembered}: loginProps) => {
    try {
        // login dengan email dan password user
        await signInWithEmailAndPassword(auth, email, password);
        // jika user mengaktifkan "Remember me"
        if (isRemembered) {
            // simpan "keepLogin" ke storage device agar user tetap login
            await saveItemToAsyncStorage("keepLogin", "true");
            // simpan email dan password user ke storage device
            await saveItemToAsyncStorage("email", JSON.stringify({password, email}));
        }
    } catch (error: any) {
        // jika login gagal / error
        let errorMessage = ValidationMessages.stillFailed;
        switch (error.code) {
            // kondisi jika email atau password user salah
            case "auth/invalid-email":
                errorMessage = ValidationMessages.invalidEmail;
                break;

            // kondisi jika email user belum terdaftar
            case "auth/invalid-credential":
                errorMessage = ValidationMessages.invalidCredentials;
                break;

            // kondisi jika password belum dimasukan
            case "auth/missing-password":
                errorMessage = ValidationMessages.passwordRequired;
                break;

            // kondisi jika email belum dimasukan
            case "auth/missing-email":
                errorMessage = ValidationMessages.emailRequired;
                break;

            // kondisi jika password salah
            case "auth/wrong-password":
                errorMessage = ValidationMessages.invalidPassword;
                break;
        }
        throw new Error(errorMessage);
    }
};

// Register
export const register = async ({email, password, name}: registerProps) => {
    try {
        // buat akun user dan menambahkan respon
        const response = await createUserWithEmailAndPassword(auth, email, password);
        // update / mengubah nama user
        await updateProfile(response.user, {displayName: name});
        // menambahkan data user ke Firebase - Firestore
        await setDoc(doc(db, "users", response.user.uid), {
            name: name,
            email: email,
            uid: response.user.uid,
            imageUrl: "/temp.png",
        });
    } catch (error: any) {
        // jika register gagal / error
        let errorMessage = ValidationMessages.stillFailed;
        switch (error.code) {
            // kondisi jika email sudah terdaftar
            case "auth/email-already-in-use":
                errorMessage = ValidationMessages.emailExist;
                break;

            // kondisi jika email belum dimasukan
            case "auth/missing-email":
                errorMessage = ValidationMessages.invalidEmail;
                break;

            // kondisi jika password belum dimasukan
            case "auth/missing-password":
                errorMessage = ValidationMessages.passwordRequired;
                break;
        }
        throw new Error(errorMessage);
    }
};

// Logout
export const logout = async () => {
    // Validasi logout firebase
    await signOut(auth);
    // hapus "keepLogin" user dari storage device
    await removeItemFromAsyncStorage("keepLogin");
};

export const getProfile = async () => {
    // ambil data user dari Firebase - Firestore
    const userRef = doc(db, `users/${auth.currentUser?.uid}`);
    const userData = await getDoc(userRef);
    // jika data user ada
    if (userData.exists()) {
        const data = userData.data();
        let name = data.name || "";
        let email = data.email || "";
        let uid = data.uid || "";
        let imageUrl = data.imageUrl || "gs://care-the-trash.appspot.com/temp.png";
        console.log(imageUrl);
        return {name: name, email: email, uid: uid, imageUrl: imageUrl};
    }
    // jika data user tidak ada
    else {
        return {name: "", email: "", uid: "", imageUrl: "gs://care-the-trash.appspot.com/temp.png"};
    }
};

export const getLevelExp = async () => {
    try {
        // ambil data point, level, exp dari Firebase - Firestore
        const pointRef = doc(db, `users/${auth.currentUser?.uid}/pointInfo/${auth.currentUser?.uid}`);
        const pointData = await getDoc(pointRef);
        if (pointData.exists()) {
            const data = pointData.data();
            let exp = data.exp || 0;
            let level = data.level || 1;
            let point = data.poin || 0;
            // define updatedExp = exp
            let updatedExp = data.exp;
            // rumus point yang dibutuhkan untuk level selanjutnya
            const pointsForNextLevel = level * 1000;
            // rumus progress level
            const progress = exp / pointsForNextLevel;

            // sistem menambah level
            if (data.exp >= pointsForNextLevel && level < 10) {
                const newLevel = level + 1;
                updatedExp = data.exp - pointsForNextLevel;
                await setDoc(doc(db, `users/${auth.currentUser?.uid}/pointInfo/${auth.currentUser?.uid}`), {level: newLevel, exp: updatedExp}, {merge: true});
                return {exp: updatedExp, level: newLevel, progress};
            }
            // jika level 10
            else if (level == 10) {
                return {exp, point, level, progress};
            }
            // jika level < 10
            else {
                return {exp, point, level, progress};
            }
        }
    } catch (error: any) {
        console.log(error);
    }
    return {exp: 0, point: 0, level: 1, progress: 0};
};

// History
export const getHistory = async () => {
    try {
        // ambil data history dari Firebase - Firestore
        const historyRef = collection(db, `users/${auth.currentUser?.uid}/history`);
        const querySnapshot = await getDocs(historyRef);
        const fetchedHistory = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return fetchedHistory;
    } catch (error: any) {
        console.log(error);
    }
};

export const getQuest = async () => {
    try {
        const questRef = collection(db, `quest/`);
        const questSnapshot = await getDocs(questRef);
        const fetchedQuest = questSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return fetchedQuest;
    } catch (error: any) {
        console.log(error);
    }
};

export const createOrder = async ({address, weight, wasteCategory, distance}: OrderProps) => {
    const orderUid = generateRandomUid();
    const orderData = {
        address: address,
        weight: weight,
        time: Date.now(),
        category: wasteCategory,
        distance: distance,
        pointObtained: pointObtained(weight, distance),
        expObtained: expObtained(weight, distance),
        uidOrder: orderUid,
        status: true,
    };

    try {
        await setDoc(doc(db, `users/${auth.currentUser?.uid}/history/${orderUid}`), orderData, {merge: true});
        await setDoc(doc(db, `users/${auth.currentUser?.uid}/pointInfo/${auth.currentUser?.uid}`), {
            poin: increment(pointObtained(weight, distance)),
            exp: increment(expObtained(weight, distance)),
        });
    } catch (error: any) {
        console.log(error);
    }
};

export const uploadImage = async (file: any) => {
    try {
        const storageRef = ref(FB_STORAGE, `users/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        const userRef = doc(db, `users/${auth.currentUser?.uid}`);
        const userData = await getDoc(userRef);
        if (userData.exists()) {
            await setDoc(userRef, {...userData.data(), imageUrl: url}, {merge: true});
            console.log("User data updated!");
        } else {
            console.log("User data not found!");
        }
        return url;
    } catch (error) {
        console.error("Image upload failed:", error);
        return "";
    }
};

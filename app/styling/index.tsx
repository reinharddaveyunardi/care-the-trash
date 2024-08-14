import { StyleSheet } from "react-native";

export const color = {
    primaryColor: "#04724D",
    secColor: "#56876D",
    white: "#ffff",
};

export const styles = StyleSheet.create({
    primaryColor: {
        color: color.primaryColor,
    },
    secColor: {
        color: color.secColor,
    },
    container: {
        flex: 1,
        gap: 10,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    centeringItems: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    fontSemiBold: {
        fontWeight: "600",
        width: "65%",
        textAlign: "center",
    },
    fontBold: {
        fontWeight: "bold",
    },
    textWhite: {
        color: color.white,
    },
    imageSmall: {
        width: 100,
        height: 100,
    },
    imageMedium: {
        width: 150,
        height: 150,
    },
    imageLarge: {
        width: 200,
        height: 200,
    },
    widthSmall: {
        width: 100,
    },
    widthMedium: {
        width: 150,
    },
    widthLarge: {
        width: 200,
    },
    textCenter: {
        textAlign: "center",
    },
});

export const ButtonStylesPresets = StyleSheet.create({
    filledBtn: {
        backgroundColor: "#56876D",
        width: 350,
        height: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 100,
    },
    borderedBtn: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#56876D",
        width: 350,
        height: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 100,
    },
});

export const TextStylesPresets = StyleSheet.create({
    titleBlack: {
        textAlign: "center",
        fontWeight: "bold",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
    },
    titleWhite: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        color: color.white,
    },
    subtitleBlack: {
        textAlign: "center",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        fontSize: 14,
    },
    subtitleWhite: {
        textAlign: "center",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: color.white,
    },
});

export const menu = StyleSheet.create({
    header: {
        flex: 1,
        height: 250,
        width: 480,
    },
});

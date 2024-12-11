import {useState, useEffect} from "react";
import {Text, StyleSheet, Animated} from "react-native";

const CustomAlert = ({visible, message, duration = 3000, onClose}: any) => {
    const [opacityAnim] = useState(new Animated.Value(0));
    const [translateYAnim] = useState(new Animated.Value(-50));

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
            const timeout = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateYAnim, {
                        toValue: -50,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    if (onClose) {
                        onClose();
                    }
                });
            }, duration);

            return () => clearTimeout(timeout);
        }
    }, [visible, opacityAnim, translateYAnim, duration, onClose]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.alertContainer, {opacity: opacityAnim}]}>
            <Text style={styles.alertMessage}>{message}</Text>
        </Animated.View>
    );
};

export default CustomAlert;

const styles = StyleSheet.create({
    alertContainer: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 15,
        borderRadius: 10,
        zIndex: 1000,
    },
    alertMessage: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
});

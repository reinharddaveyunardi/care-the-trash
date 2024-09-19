import { Ionicons } from "@expo/vector-icons";
import { Button, View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Progress from "react-native-progress";
import { color } from "@/app/styling";

function ModalScreen({ navigation, route }: any) {
    const { level, progress, poin } = route.params;
    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}
        >
            <View
                style={{
                    shadowColor: "#171717",
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    backgroundColor: color.white,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    elevation: 10,
                    zIndex: 10,
                }}
            >
                <View
                    style={{
                        height: 70,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        backgroundColor: color.white,
                        elevation: 5,
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color="black" left={25} top={25} onPress={() => navigation.goBack()} />
                </View>
                <View
                    style={{
                        height: 90,
                        alignItems: "flex-start",
                        borderBottomRightRadius: 20,
                        borderBottomLeftRadius: 20,
                        paddingLeft: 30,
                        backgroundColor: color.white,
                    }}
                >
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        <Text>Your Level: {level}</Text>
                        <View>
                            <Text>Progress: {Math.round(progress * 100)}%</Text>
                            <Progress.Bar progress={progress} width={230} borderColor={color.secColor} color={color.secColor} />
                        </View>
                    </View>
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    gap: 20,
                }}
            >
                <Text
                    style={{
                        textAlign: "center",
                        marginBottom: 20,
                        fontSize: 20,
                    }}
                >
                    Redeem
                </Text>
                <View style={{ gap: 20, paddingBottom: 20 }}>
                    <RedeemCard title="Spinach" category="Vegetable" price={100} />
                    <RedeemCard title="Carrot" category="Vegetable" price={150} />
                    <RedeemCard title="Apple" category="Fruit" price={200} />
                    <RedeemCard title="Pineapple" category="Fruit" price={250} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ModalScreen;

function RedeemCard({ navigation, title, category, price }: any) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    shadowOffset: { width: -1, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    backgroundColor: color.white,
                    elevation: 5,
                    gap: 8,
                    width: "80%",
                    padding: 10,
                    borderRadius: 10,
                }}
            >
                <Image source={getImage(title)} style={{ width: 100, height: 100, alignItems: "center" }} />
                <View>
                    <Text>Name: {title}</Text>
                    <Text>Category: {category}</Text>
                    <Text>Price: {price} points</Text>
                </View>
                <TouchableOpacity
                    disabled
                    style={{
                        backgroundColor: color.primaryColor,
                        padding: 10,
                        borderRadius: 10,
                    }}
                    onPress={() => navigation.navigate("(redeemItemInfo)")}
                >
                    <Text style={{ color: color.white }}>More Information (Not Available)</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getImage = (imageName: string) => {
    switch (imageName) {
        case "Spinach":
            return require("@/assets/images/Spinach.jpg");
        case "Carrot":
            return require("@/assets/images/Carrot.jpg");
        case "Apple":
            return require("@/assets/images/Apple.webp");
        case "Pineapple":
            return require("@/assets/images/Pineapple.png");
        default:
            return require("@/assets/images/Spinach.jpg");
    }
};

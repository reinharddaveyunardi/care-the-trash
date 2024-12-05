import React, {useState, useRef} from "react";
import {StatusBar, Text, TouchableOpacity, View, RefreshControl, ScrollView, Image} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import * as Progress from "react-native-progress";
import {FontAwesome6, Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {ColorPallet} from "@/constants/Colors";
import {redeemItems} from "@/data/Placehold";
import {getLevelExp, getQuest} from "@/services/api";
import Quest from "@/components/Quest";
import {useTranslation} from "react-i18next";
import i18n from "@/localization/i18n";

const MenuScreen = ({navigation}: any) => {
    const {t} = useTranslation();
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState({exp: 0, level: 1, progress: 0, point: 0});
    const [loading, setLoading] = useState(true);
    const [fetched, setFetched] = useState(false);
    const [isCartMode, setIsCartMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [cartItems, setCartItems] = useState<any[]>([]);
    const cartHandlerToggle = () => setIsCartMode((prev) => !prev);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetRefRedeemInfo = useRef<BottomSheet>(null);
    const handleDecreaseQuantity = (index: number) => {
        const newCartItems = [...cartItems];
        const item = newCartItems[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            newCartItems.splice(index, 1);
        }
        setCartItems(newCartItems);
    };
    const handleIncreaseQuantity = (index: number) => {
        const newCartItems = [...cartItems];
        const item = newCartItems[index];
        item.quantity += 1;
        setCartItems(newCartItems);
    };
    const addToCart = (name: string, image: any, price: any) => {
        const existingItem = cartItems.find((item) => item.name === name);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
            setCartItems([...cartItems]);
        } else {
            const newItem = {
                name: name,
                image: image,
                price: price,
                quantity: 1,
            };
            setCartItems([...cartItems, newItem]);
        }
    };

    const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const isPointEnough = data.point >= totalCost;

    async function fetchData() {
        try {
            const {exp, level, progress, point} = await getLevelExp();
            setData({exp, level, progress, point});
            await getQuest();
        } catch (e) {
            console.log(e);
        }
    }
    if (!fetched) {
        setTimeout(() => {
            fetchData();
            setLoading(false);
            setFetched(true);
        }, 1000);
    }

    const onRefresh = () => {
        setLoading(true);
        setRefresh(true);
        fetchData();
        setTimeout(() => {
            setRefresh(false);
            setLoading(false);
        }, 2000);
    };
    return (
        <SafeAreaView style={{flex: 1, zIndex: 1, backgroundColor: "white"}}>
            <StatusBar backgroundColor={ColorPallet.primary} />
            <View style={{position: "absolute", width: "100%", zIndex: 10, top: "4%"}}>
                <View style={{flexDirection: "row", marginHorizontal: "4.5%", justifyContent: "space-between", alignItems: "center", height: 50}}>
                    <View>
                        <Ionicons name="menu" size={20} color={ColorPallet.white} onPress={() => navigation.openDrawer()} />
                    </View>
                    <View style={{flexDirection: "row", gap: 5}}>
                        <TouchableOpacity
                            onPress={() => {
                                bottomSheetRef.current?.expand();
                                cartHandlerToggle();
                            }}
                            style={{width: 40, height: 40, alignItems: "center", justifyContent: "center"}}
                        >
                            <Ionicons name="cart" size={20} color={ColorPallet.white} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Profile")}
                            style={{width: 40, height: 40, alignItems: "center", justifyContent: "center"}}
                        >
                            <Ionicons name="person" size={20} color={ColorPallet.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}>
                <View>
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: ColorPallet.primary,
                            height: 280,
                            padding: 20,
                        }}
                    >
                        <View>
                            <Text style={{fontSize: 45, fontWeight: "bold", color: "rgba(255,255,255, 0.5)"}}>CARE</Text>
                            <Text style={{fontSize: 45, fontWeight: "bold", color: "rgba(255,255,255, 0.5)"}}>THE</Text>
                            <Text style={{fontSize: 45, fontWeight: "bold", color: "rgba(255,255,255, 0.5)"}}>TRASH</Text>
                        </View>
                        <View>
                            <Image source={require("@/assets/images/recycle.png")} style={{width: 150, height: 150, transform: [{rotate: "90deg"}]}} />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={{position: "absolute", top: 250, width: "100%"}}>
                <View style={{alignItems: "center", width: "100%", justifyContent: "center"}}>
                    <View
                        style={{
                            backgroundColor: ColorPallet.white,
                            alignItems: "center",
                            gap: 5,
                            width: "90%",
                            height: 80,
                            borderRadius: 20,
                            justifyContent: "space-around",
                            paddingHorizontal: "5%",
                            flexDirection: "row",
                            elevation: 5,
                        }}
                    >
                        <View>
                            <Image source={require("@/assets/images/icon.png")} style={{width: 30, height: 75}} />
                        </View>
                        <View style={{height: 50, backgroundColor: "rgba(0,0,0, 0.5)", width: 2}} />
                        <View style={{gap: 5}}>
                            <Text style={{textAlign: "center"}}>
                                {t("Menu.point")}
                                {i18n.language == "en" ? (data.point > 1 ? "s" : null) : ""}: {data.point}
                            </Text>
                            <View style={{justifyContent: "center", gap: 2}}>
                                <Text style={{textAlign: "center"}}>
                                    {t("Menu.level")}: {data.level}
                                </Text>
                                <Progress.Bar progress={data.progress} width={70} unfilledColor={ColorPallet.white} color={ColorPallet.primary} />
                            </View>
                        </View>
                        <View style={{height: 50, backgroundColor: "rgba(0,0,0, 0.5)", width: 2}} />
                        <TouchableOpacity
                            onPress={() => {
                                bottomSheetRef.current?.expand(), cartHandlerToggle();
                            }}
                        >
                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5}}>
                                <Ionicons name="gift" size={30} color={ColorPallet.primary} />
                                <Text style={{textAlign: loading ? "center" : "left"}}>{t("Menu.redeem")}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{top: 20, alignItems: "center", flexDirection: "row", justifyContent: "space-around"}}>
                    <View>
                        <TouchableOpacity
                            style={{alignItems: "center", justifyContent: "center"}}
                            onPress={() => navigation.navigate("Organik", {wasteCategory: "Organic"})}
                        >
                            <View
                                style={{
                                    backgroundColor: "rgba(0, 139, 65, 0.6)",
                                    width: 55,
                                    height: 55,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 10,
                                }}
                            >
                                <Ionicons name="leaf" size={30} color={ColorPallet.primary} />
                            </View>
                            <Text>{t("Menu.organic")}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{alignItems: "center"}} onPress={() => navigation.navigate("Anorganik", {wasteCategory: "Inorganic"})}>
                        <View
                            style={{
                                backgroundColor: "rgba(30, 73, 179, 0.6)",
                                width: 55,
                                height: 55,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,
                            }}
                        >
                            <FontAwesome6 name="bottle-water" size={30} color={ColorPallet.blue} />
                        </View>
                        <Text>{t("Menu.inorganic")}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{top: 40, marginLeft: "5.5%", width: "100%"}}>
                    <Text>{t("Menu.quest")}</Text>
                    <Quest />
                </View>
            </View>

            {/* Bottom Sheet */}

            <BottomSheet
                ref={bottomSheetRef}
                style={{backgroundColor: ColorPallet.white, zIndex: 99}}
                enablePanDownToClose
                index={-1}
                snapPoints={["10%", "40%", "65%"]}
            >
                <View style={{flexDirection: "row", justifyContent: "space-between", width: "85%", alignItems: "center", marginHorizontal: "5%"}}>
                    <View>
                        <Text>
                            {t("Menu.level")}: {data.level}
                        </Text>
                        <Text>
                            {t("Menu.point")}
                            {i18n.language == "en" ? (data.point > 1 ? "s" : null) : ""}: {data.point}
                        </Text>
                    </View>
                    {isCartMode ? (
                        <TouchableOpacity onPress={() => cartHandlerToggle()}>
                            <Ionicons name="gift" size={30} color={ColorPallet.primary} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => cartHandlerToggle()}>
                            <Ionicons name="cart" size={30} color={ColorPallet.primary} />
                        </TouchableOpacity>
                    )}
                </View>
                {isCartMode ? (
                    <View>
                        <ScrollView>
                            <View style={{gap: 10, alignItems: "center", width: "100%", marginTop: "5%"}}>
                                {cartItems.length > 0 ? (
                                    cartItems.map((item, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                width: "95%",
                                                paddingHorizontal: 10,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: ColorPallet.white,
                                                borderRadius: 10,
                                                elevation: 5,
                                                height: 80,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    justifyContent: "space-between",
                                                    width: "100%",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 10,
                                                }}
                                            >
                                                <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                                                    <Image source={item.image} style={{width: 50, height: 50}} />
                                                    <Text style={{fontSize: 15}}>{item.name}</Text>
                                                </View>
                                                <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                                                    <TouchableOpacity
                                                        onPress={() => handleIncreaseQuantity(index)}
                                                        style={{backgroundColor: ColorPallet.white, elevation: 1, borderRadius: 50}}
                                                    >
                                                        <Ionicons name="add-circle" size={30} color={ColorPallet.primary} />
                                                    </TouchableOpacity>
                                                    <Text>{item.quantity}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => handleDecreaseQuantity(index)}
                                                        style={{backgroundColor: ColorPallet.white, elevation: 1, borderRadius: 50}}
                                                    >
                                                        <Ionicons name="remove-circle" size={30} color={ColorPallet.primary} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View>
                                        <Text>{t("Menu.cartEmpty")}</Text>
                                    </View>
                                )}
                            </View>

                            {cartItems.length > 0 ? (
                                <View style={{gap: 10, alignItems: "center", width: "100%", marginTop: "5%"}}>
                                    <Text style={{marginLeft: "5%"}}>
                                        Total: {totalCost} {totalCost > 1 ? (i18n.language == "en" ? "s" : "") : ""}
                                    </Text>
                                    <View style={{width: "100%", alignItems: "center"}}>
                                        <TouchableOpacity
                                            disabled={!isPointEnough}
                                            style={{
                                                backgroundColor: isPointEnough ? ColorPallet.primary : ColorPallet.red,
                                                opacity: isPointEnough ? 1 : 0.7,
                                                padding: 10,
                                                height: 50,
                                                justifyContent: "center",
                                                width: "95%",
                                                alignItems: "center",
                                                borderRadius: 10,
                                            }}
                                        >
                                            {isPointEnough ? (
                                                <View>
                                                    <Text style={{color: ColorPallet.white, fontWeight: "bold"}}>{t("Menu.redeem")}</Text>
                                                </View>
                                            ) : (
                                                <View>
                                                    <Text style={{color: ColorPallet.white, fontWeight: "bold"}}>
                                                        {t("Menu.notEnoughPoint")} ( {data.point - totalCost} {t("Menu.point")}
                                                        {i18n.language == "en" ? "s" : ""} )
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : null}
                        </ScrollView>
                    </View>
                ) : (
                    <BottomSheetScrollView style={{marginTop: "10%"}} showsVerticalScrollIndicator={false}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: ColorPallet.white,
                                marginTop: 10,
                            }}
                        >
                            <View style={{gap: 20, paddingBottom: 20}}>
                                {redeemItems.map((item, index) => (
                                    <RedeemCard
                                        addToCart={addToCart}
                                        onSelectedItem={selectedItem}
                                        key={index}
                                        title={item.name}
                                        category={item.cat}
                                        price={item.price}
                                        image={item.image}
                                        bottomSheetRefRedeemInfo={bottomSheetRefRedeemInfo}
                                    />
                                ))}
                            </View>
                        </View>
                    </BottomSheetScrollView>
                )}
            </BottomSheet>
        </SafeAreaView>
    );
};

function RedeemCard({title, category, price, image, addToCart}: any) {
    const {t} = useTranslation();
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
                    shadowOffset: {width: -1, height: 4},
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    backgroundColor: ColorPallet.white,
                    elevation: 5,
                    gap: 8,
                    width: "80%",
                    padding: 10,
                    borderRadius: 10,
                }}
            >
                <Image source={image} style={{width: 100, height: 100, alignItems: "center"}} />
                <View>
                    <Text>Name: {title}</Text>
                    <Text>Category: {category}</Text>
                    <Text>Price: {price} points</Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: ColorPallet.primary,
                        padding: 10,
                        borderRadius: 10,
                        flexDirection: "row",
                        gap: 5,
                    }}
                    onPress={() => addToCart(title, image, price)}
                >
                    <Text style={{color: ColorPallet.white}}>{t("Menu.addToCart")}</Text>
                    <Ionicons name="cart-outline" size={20} color={ColorPallet.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default MenuScreen;

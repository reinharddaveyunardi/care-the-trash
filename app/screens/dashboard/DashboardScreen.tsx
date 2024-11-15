import React, {useState, useRef} from "react";
import {Image, StatusBar, Text, TouchableOpacity, View, RefreshControl, ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import * as Progress from "react-native-progress";
import {color} from "../../styling";
import {FontAwesome6, Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {ColorPallet} from "@/constants/Colors";
import {redeemItems} from "@/data/Placehold";
import {getLevelExp} from "@/services/api";
import {Skeleton} from "moti/skeleton";
import {style} from "twrnc";

const MenuScreen = ({navigation}: any) => {
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState({exp: 0, level: 1, progress: 0, point: 0});
    const [loading, setLoading] = useState(true);
    const [fetched, setFetched] = useState(false);
    const [isCartMode, setIsCartMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [imageSelectedItem, setImageSelectedItem] = useState("");
    const [descSelectedItem, setDescSelectedItem] = useState("");
    const [cartItems, setCartItems] = useState<any[]>([]);
    const cartHandlerToggle = () => setIsCartMode((prev) => !prev);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const bottomSheetRefRedeemInfo = useRef<BottomSheet>(null);

    const handleSelectedItem = (item: string, image: string, desc: string) => {
        setSelectedItem(item);
        setImageSelectedItem(image);
        setDescSelectedItem(desc);
        bottomSheetRef.current?.snapToIndex(1);
    };

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
            console.log(data);
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
            <View style={{position: "absolute", top: "5%", width: "100%", zIndex: 10}}>
                <View style={{flexDirection: "row", marginHorizontal: "4.5%", justifyContent: "space-between", alignItems: "center", height: 50}}>
                    <View>
                        <Ionicons name="menu" size={20} color={ColorPallet.white} onPress={() => navigation.openDrawer()} />
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Profile")}
                        style={{width: 40, height: 40, alignItems: "center", justifyContent: "center"}}
                    >
                        <Ionicons name="person" size={20} color={ColorPallet.white} />
                    </TouchableOpacity>
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
            <View style={{position: "absolute", top: 280, width: "100%"}}>
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
                            <Skeleton show={loading} width={70} height={15} colorMode="light">
                                {data.point !== undefined ? (
                                    <Text style={{textAlign: "center"}}>Point: {data.point}</Text>
                                ) : (
                                    <Skeleton width={70} height={15} colorMode="light" />
                                )}
                            </Skeleton>
                            <View style={{justifyContent: "center", gap: 2}}>
                                <Skeleton show={loading} width={70} height={15} colorMode="light">
                                    {data.level !== undefined ? (
                                        <Text style={{textAlign: "center"}}>Level: {data.level}</Text>
                                    ) : (
                                        <Skeleton width={70} height={15} />
                                    )}
                                </Skeleton>
                                {!loading && data.progress !== undefined ? (
                                    <Progress.Bar progress={data.progress} width={70} unfilledColor={ColorPallet.white} color={ColorPallet.primary} />
                                ) : null}
                            </View>
                        </View>
                        <View style={{height: 50, backgroundColor: "rgba(0,0,0, 0.5)", width: 2}} />
                        <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5}}>
                                <Skeleton show={loading} width={30} height={30} colorMode="light">
                                    {data.point !== undefined ? <Ionicons name="gift" size={30} color={ColorPallet.primary} /> : null}
                                </Skeleton>
                                <Skeleton show={loading} width={60} height={15} colorMode="light">
                                    {data.point !== undefined ? <Text style={{textAlign: loading ? "center" : "left"}}>Redeem</Text> : null}
                                </Skeleton>
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
                            <Text>Organic</Text>
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
                        <Text>Inorganic</Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={{top: 40, marginLeft: "5.5%"}}>
                    <Text>Quest</Text>
                </View> */}
            </View>

            {/* Bottom Sheet */}

            <BottomSheet ref={bottomSheetRef} style={{backgroundColor: ColorPallet.white}} enablePanDownToClose index={-1} snapPoints={["10%", "40%", "65%"]}>
                <View style={{elevation: 5, justifyContent: "space-evenly", flexDirection: "row", alignItems: "center"}}>
                    <View>
                        <Text>Your Level: {data.level}</Text>
                        <View>
                            <Text>
                                Your point{data.point > 1 ? "s" : ""}: {data.point}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => cartHandlerToggle()}>
                            <View>
                                <View
                                    style={{
                                        position: "absolute",
                                        backgroundColor: ColorPallet.red,
                                        zIndex: 10,
                                        width: 20,
                                        borderRadius: 20,
                                        height: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        display: isCartMode ? "none" : "flex",
                                    }}
                                >
                                    <Text style={{color: ColorPallet.white}}>{totalCost / 100}</Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                    <Ionicons name={!isCartMode ? "cart" : "chevron-back"} color={ColorPallet.primary} size={35} />
                                    {isCartMode && <Text style={{color: ColorPallet.primary}}>Go Back</Text>}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
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
                                                elevation: 1,
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
                                                    <Image source={{uri: item.image}} style={{width: 50, height: 50}} />
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
                                                    <TouchableOpacity onPress={() => handleDecreaseQuantity(index)}>
                                                        <Ionicons name="remove-circle" size={30} color={ColorPallet.primary} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View>
                                        <Text>Your cart is empty</Text>
                                    </View>
                                )}
                            </View>
                            {isCartMode ? (
                                <View>
                                    <Text style={{marginLeft: "5%"}}>
                                        Total: {totalCost} {totalCost > 1 ? "points" : "point"}
                                    </Text>
                                    <View style={{width: "100%", alignItems: "center"}}>
                                        <TouchableOpacity
                                            disabled={!isPointEnough}
                                            activeOpacity={0.8}
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
                                                    <Text style={{color: ColorPallet.white, fontWeight: "bold"}}>Redeem</Text>
                                                </View>
                                            ) : (
                                                <View>
                                                    <Text style={{color: ColorPallet.white, fontWeight: "bold"}}>
                                                        Not enough point ( need {data.point - totalCost} points)
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
                    backgroundColor: color.white,
                    elevation: 5,
                    gap: 8,
                    width: "80%",
                    padding: 10,
                    borderRadius: 10,
                }}
            >
                <Image source={{uri: image}} style={{width: 100, height: 100, alignItems: "center"}} />
                <View>
                    <Text>Name: {title}</Text>
                    <Text>Category: {category}</Text>
                    <Text>Price: {price} points</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: color.primaryColor,
                        padding: 10,
                        borderRadius: 10,
                        flexDirection: "row",
                        gap: 5,
                    }}
                    onPress={() => addToCart(title, image, price)}
                >
                    <Text style={{color: color.white}}>Add to cart</Text>
                    <Ionicons name="cart-outline" size={20} color={color.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default MenuScreen;

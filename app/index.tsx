import { NavigationContainer } from "@react-navigation/native";
import GetStartedScreen from "./screens/start/GetStartedScreen";
import LoginScreen from "./screens/LoginScreen";
import MenuScreen from "./screens/MenuScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ModalScreen from "@/components/Modal";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { FB_AUTH } from "@/FirebaseConfig";
import SettingsScreen from "./screens/SettingsScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrderScreen from "./screens/[type]/OrderScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ReceiptScreen from "./screens/receipt";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const InsideStack = createStackNavigator();

function InsideLayout() {
    return (
        <InsideStack.Navigator>
            <InsideStack.Screen name="Menu" component={MenuDrawer} options={{ headerShown: false }} />
            <InsideStack.Screen name="Modal" component={ModalScreen} options={{ headerShown: false }} />
            <InsideStack.Group screenOptions={{ presentation: "modal" }}>
                <InsideStack.Screen name="poinModal" component={ModalScreen} options={{ headerShown: false }} />
            </InsideStack.Group>
            <InsideStack.Screen name="Organik" component={OrderScreen} options={{ headerShown: false }} />
            <InsideStack.Screen name="Anorganik" component={OrderScreen} options={{ headerShown: false }} />
            <InsideStack.Screen name="Limbah" component={OrderScreen} options={{ headerShown: false }} />
            <InsideStack.Screen name="Receipt" component={ReceiptScreen} options={{ headerShown: false }} />
        </InsideStack.Navigator>
    );
}

function MenuDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName="MenuScreen"
            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: "#56876D",
                gestureHandlerProps: {
                    enabled: false,
                },
            }}
        >
            <Drawer.Group>
                <Drawer.Screen
                    name="Home"
                    component={MenuScreen}
                    options={{
                        headerShown: false,
                        drawerIcon: () => <Ionicons name="home" color={"#56876D"} />,
                    }}
                />
                <Drawer.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{
                        headerShown: false,
                        drawerIcon: () => <Ionicons name="time" color={"#56876D"} />,
                    }}
                />
                <Drawer.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        headerShown: false,
                        drawerIcon: () => <Ionicons name="person" color={"#56876D"} />,
                    }}
                />
            </Drawer.Group>
        </Drawer.Navigator>
    );
}

export default function Index() {
    const [user, setUser] = useState<User | null>(null);
    const [initialRoute, setInitialRoute] = useState("GetStarted");

    useEffect(() => {
        const userSession = onAuthStateChanged(FB_AUTH, (user) => {
            if (user) {
                setUser(user);
                setInitialRoute("Inside");
            } else {
                setUser(null);
                setInitialRoute("GetStarted");
            }
        });
        return () => userSession();
    }, []);

    useEffect(() => {
        onAuthStateChanged(FB_AUTH, (user) => {
            console.log(`%cUser Status:`, "background: yellow;", user);
            setUser(user);
        });
    }, []);
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName={initialRoute}>
                {user ? (
                    <Stack.Screen name="Inside" options={{ headerShown: false }} component={InsideLayout} />
                ) : (
                    <>
                        <Stack.Screen name="GetStarted" options={{ headerShown: false }} component={GetStartedScreen} />
                        <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
                        <Stack.Screen name="Register" options={{ headerShown: false }} component={RegisterScreen} />
                    </>
                )}

                <Stack.Screen name="Menu" component={MenuDrawer} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

import {NavigationContainer} from "@react-navigation/native";
import GetStartedScreen from "./screens/start/GetStartedScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import {createStackNavigator} from "@react-navigation/stack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/profile/ProfileScreen";
import OrderScreen from "./screens/[type]/OrderScreen";
import HistoryScreen from "./screens/history/HistoryScreen";
import ReceiptScreen from "./screens/receipt";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const InsideStack = createStackNavigator();

function InsideLayout() {
    return (
        <InsideStack.Navigator>
            <InsideStack.Screen name="Menu" component={MenuDrawer} options={{headerShown: false}} />
            <InsideStack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
            <InsideStack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
            <InsideStack.Screen name="Organik" component={OrderScreen} options={{headerShown: false}} />
            <InsideStack.Screen name="Anorganik" component={OrderScreen} options={{headerShown: false}} />
            <InsideStack.Screen name="Limbah" component={OrderScreen} options={{headerShown: false}} />
            <InsideStack.Screen name="Receipt" component={ReceiptScreen} options={{headerShown: false}} />
        </InsideStack.Navigator>
    );
}

function MenuDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName="DashboardScreen"
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
                    component={DashboardScreen}
                    options={{
                        headerShown: false,
                        drawerIcon: () => <Ionicons name="home" color={"#56876D"} />,
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
                <Drawer.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{
                        headerShown: false,
                        drawerIcon: () => <Ionicons name="time" color={"#56876D"} />,
                    }}
                />
            </Drawer.Group>
        </Drawer.Navigator>
    );
}

export default function Index() {
    const [logged, setIsLogged] = useState<String | null>(null);
    const getLoggedInfo = async () => {
        const keepLogin = await AsyncStorage.getItem("keepLogin");
        setIsLogged(keepLogin);
    };
    getLoggedInfo();
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName={logged === "true" ? "Inside" : "GetStarted"}>
                {logged === "true" ? (
                    <>
                        <Stack.Screen name="Inside" options={{headerShown: false}} component={InsideLayout} />
                        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
                        <Stack.Screen name="Register" options={{headerShown: false}} component={RegisterScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="GetStarted" options={{headerShown: false}} component={GetStartedScreen} />
                        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
                        <Stack.Screen name="Inside" options={{headerShown: false}} component={InsideLayout} />
                        <Stack.Screen name="Register" options={{headerShown: false}} component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

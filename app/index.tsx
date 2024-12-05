import {NavigationContainer} from "@react-navigation/native";
import GetStartedScreen from "./screens/start/GetStartedScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import MenuScreen from "./screens/dashboard/DashboardScreen";
import {createStackNavigator} from "@react-navigation/stack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {Ionicons} from "@expo/vector-icons";
import {useState} from "react";
import RegisterScreen from "./screens/auth/RegisterScreen";
import ProfileScreen from "./screens/profile/ProfileScreen";
import OrderScreen from "./screens/[type]/OrderScreen";
import HistoryScreen from "./screens/history/HistoryScreen";
import ReceiptScreen from "./screens/receipt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangePassword from "./screens/auth/ChangePassword";
import {LogBox} from "react-native";
import {I18nextProvider} from "react-i18next";
import i18n from "@/localization/i18n";
LogBox.ignoreLogs(["Reanimated 2"]);

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const InsideStack = createStackNavigator();

function ProfileLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile Details" component={ProfileScreen} options={{headerShown: false}} />
            <Stack.Screen name="Reset" component={ChangePassword} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

function InsideLayout() {
    return (
        <InsideStack.Navigator>
            <InsideStack.Screen name="Menu" component={MenuDrawer} options={{headerShown: false}} />
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
            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: "#56876D",
            }}
        >
            <Drawer.Group screenOptions={{}}>
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
                    component={ProfileLayout}
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
    const [isStillLoggedIn, setIsStillLoggedIn] = useState(false);

    const getUserLogin = async () => {
        const keepLogin = await AsyncStorage.getItem("keepLogin");
        if (keepLogin === "true") {
            setIsStillLoggedIn(true);
        }
    };

    try {
        getUserLogin();
    } catch (e) {
        console.log(e);
    }
    return (
        <I18nextProvider i18n={i18n}>
            <Stack.Navigator>
                {isStillLoggedIn ? (
                    <Stack.Screen name="Inside" options={{headerShown: false}} component={InsideLayout} />
                ) : (
                    <>
                        <Stack.Screen name="GetStarted" options={{headerShown: false}} component={GetStartedScreen} />
                        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
                        <Stack.Screen name="Inside" options={{headerShown: false}} component={InsideLayout} />
                        <Stack.Screen name="Register" options={{headerShown: false}} component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </I18nextProvider>
    );
}

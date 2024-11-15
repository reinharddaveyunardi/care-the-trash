import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveItemToAsyncStorage = (key: string, value: string) => AsyncStorage.setItem(key, value);
export const getItemFromAsyncStorage = (key: string) => AsyncStorage.getItem(key);
export const removeItemFromAsyncStorage = (key: string) => AsyncStorage.removeItem(key);
export const clearAsyncStorage = () => AsyncStorage.clear();

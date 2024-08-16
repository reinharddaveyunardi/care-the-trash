import { NavigationProp } from "@react-navigation/native";

export interface NavgiationsProps {
    navigation: NavigationProp<any, any>;
}

export interface coordsInfo {
    coords: {
        latitude: number;
        longitude: number;
    };
}
export interface OrderScreenProps {
    route: {
        params: {
            wasteCategory: string;
        };
    };
    navigation: any;
}

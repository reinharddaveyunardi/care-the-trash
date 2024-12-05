import {NavigationProp} from "@react-navigation/native";

// Props login
export interface loginProps {
    email: string;
    password: string;
    isRemembered: boolean;
}

// Props register
export interface registerProps {
    name: string;
    email: string;
    password: string;
}

// Map props
export interface MapProps {
    setIsCalculatingRoute: any;
    handleReady: any;
    handleError: any;
    waste: string;
    navigation: any;
}

// Order props
export interface OrderProps {
    address: string;
    weight: string;
    distance: number;
    wasteCategory: string;
}

// Quest Props
export interface QuestProps {
    key: number;
    title: string;
    desc: string;
    progress: number;
    reward: [];
    type: string;
    point: number;
    exp: number;
    until: any;
    currentProgress: number;
}
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

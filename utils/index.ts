// Utility untuk Map
export const destination = {
    latitude: -6.365503,
    longitude: 106.978508,
};
export const getPlaceNameFromCoordinates = async (latitude: number, longitude: number) => {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
        const fullAddress = data.results[1].formatted_address;
        return cleanAddress(fullAddress);
    } else {
        throw new Error("Unable to get place name");
    }
};
export const cleanAddress = (fullAddress: string) => {
    let cleanedAddress = fullAddress.replace(/^[A-Za-z0-9\+]+,\s*/, "");
    const regex = /(Kabupaten|Provinsi|Kota|Kec\.)\s.+$/;
    cleanedAddress = cleanedAddress.replace(regex, "").trim();
    return cleanedAddress;
};

// Utility untuk Order
// Rumus point didapat
export const pointObtained = (weight: string, distance: number) => Math.round(parseInt(weight) * 0.2 + 5 * (distance / 2));
export const expObtained = (weight: string, distance: number) => Math.round(5 * ((distance / 2) * parseInt(weight)));

export const generateRandomUid = (length: number = 16): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

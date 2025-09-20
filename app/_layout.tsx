import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Text } from "react-native";
import "../global.css";

export default function RootLayout() {
    const [loaded] = useFonts({
        Futura: require("../assets/fonts/Futura Regular.ttf"),
        FuturaBold: require("../assets/fonts/Futura Black.ttf"),
        FuturaMedium: require("../assets/fonts/Futura Medium.otf")
    });

    if (!loaded) {
        return <Text>Loading...</Text>;
    }


    return <Stack screenOptions={{headerShown: false}} />;
}

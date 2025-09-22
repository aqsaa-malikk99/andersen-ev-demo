import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {router} from "expo-router";
import * as SecureStore from 'expo-secure-store';

const SplashScreen = () => {
    useEffect(() => {
        SecureStore.getItemAsync("userSession").then(
            storedUser => {
                setTimeout(()=>{
                    if (storedUser) {
                        const user = JSON.parse(storedUser);
                        router.replace({pathname: "/(tabs)", params: {user: JSON.stringify(user)}});
                    } else {
                        router.replace("/authentication/login");
                    }
                },5000);

            }
        );
    }, []);
    return (
        <View className="flex-1 justify-center items-center bg-[#3a3a3c]">
            <Text className="text-white font-[Futura] text-3xl font-medium tracking-[12]">
                ANDERSEN
            </Text>
        </View>
    );
};

export default SplashScreen;
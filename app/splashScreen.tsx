import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {router} from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import {setUser} from "@/app/store/userSlice";
const SplashScreen = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        SecureStore.getItemAsync("userSession").then((storedUser) => {
            setTimeout(() => {
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    console.log(user);
                    dispatch(setUser(user));
                    router.replace("/(tabs)");
                } else {
                    router.replace("/authentication/login");
                }
            }, 2000);
        });
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
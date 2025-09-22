
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/app/constants/theme";
import * as SecureStore from 'expo-secure-store';
import {Link, router} from "expo-router";



export default function Profile() {
    const [editMode, setEditMode] = useState(false);

    // Form state
    const [name, setName] = useState("Andrews Manager");
    const [dob, setDob] = useState("01/01/1990");
    const [email, setEmail] = useState("andrews@example.com");
    const [countryCode, setCountryCode] = useState("+44");
    const [phone, setPhone] = useState("7494882999");

    const toggleEdit = () => setEditMode(!editMode);

    const  logOut= async ()=>{
        await  SecureStore.deleteItemAsync("userSession");
        console.log("logOut");
        router.push("/authentication/login");

    }

    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Profile picture */}


                {/* Name */}
                <Text className="text-center text-xl font-[Futura] font-bold mb-3">{name}</Text>


                {/* Editable Fields */}
                <View className="space-y-4">
                    {/* Name */}
                    <View className={`flex-row items-center rounded border ${
                        editMode ? "bg-white": "bg-gray-100"
                    } border-gray-200 p-5 m-2`}>
                        <Ionicons name="person" size={22} color="gray" className="mr-2 px-2" />
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            editable={editMode}
                            placeholder="Your Name"
                            className="flex-1 text-1xl py-2 font-[Futura]"
                        />
                    </View>

                    {/* Date of Birth */}
                    <View className={`flex-row items-center rounded border ${
                        editMode ? "bg-white": "bg-gray-100"
                    } border-gray-200 p-5 m-2`}>
                        <Ionicons name="calendar" size={20} color="gray" className="mr-2" />
                        <TextInput
                            value={dob}
                            onChangeText={setDob}
                            editable={editMode}
                            placeholder="Date of Birth"
                            className="flex-1 py-2 font-[Futura]"
                        />
                    </View>

                    {/* Email */}
                    <View className={`flex-row items-center rounded border ${
                        editMode ? "bg-white": "bg-gray-100"
                    } border-gray-200 p-5 m-2`}>
                        <Ionicons name="mail" size={20} color="gray" className="mr-2" />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            editable={editMode}
                            placeholder="Email Address"
                            keyboardType="email-address"
                            className="flex-1 py-2 font-[Futura]"
                        />
                    </View>

                    {/* Phone Number */}
                    <View className={`flex-row items-center rounded border ${
                        editMode ? "bg-white": "bg-gray-100"
                    } border-gray-200 p-5 m-2`}>
                        <Ionicons name="call" size={20} color="gray" className="mr-2" />

                        {/* Country Code */}
                        <TextInput
                            value={countryCode}
                            onChangeText={setCountryCode}
                            editable={editMode}
                            placeholder="CC"
                            keyboardType="phone-pad"
                            className="w-16 py-2 font-[Futura] border-r border-gray-200 text-center"
                        />

                        {/* Phone */}
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            editable={editMode}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            className="flex-1 py-2 pl-2 font-[Futura]"
                        />
                    </View>

                    {/* Edit/Save button */}
                    <TouchableOpacity
                        onPress={toggleEdit}
                        className={`mt-4 p-5 rounded-lg m-2 ${
                            editMode ? "bg-green" : "bg-black"
                        } items-center`}
                    >
                        <Text className="text-white font-[FuturaMedium]">
                            {editMode ? "Save" : "Edit Profile"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={logOut}
                        className="mt-4 p-5 rounded-lg m-2 border border-red-500 items-center"

                    >
                        <Text className="text-red-500 font-[FuturaMedium]">
                           Log out
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

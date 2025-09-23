
import { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/app/constants/theme";
import * as SecureStore from 'expo-secure-store';
import {Link, router} from "expo-router";

import {useDispatch, useSelector} from "react-redux";
import { RootState } from "@/app/store";
import {updateUser} from "@/app/store/userSlice";
import {updateRecord} from "@/app/db/crud";
import {TABLES} from "@/app/constants/table";


export default function Profile() {
    const [editMode, setEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const user = useSelector((state: RootState) => state.user.user);
    // Pre-fill fields from Redux
    const [firstName, setFirstName] = useState(user?.firstName ?? "");
    const [lastName, setLastName] = useState(user?.lastName ?? "");
    const [dob, setDob] = useState(
        user?.dob ? new Date(user.dob).toISOString().split("T")[0] : ""
    );
    const [email, setEmail] = useState(user?.email ?? "");


    const [phone, setPhone] = useState(
        user?.phone ??""
    );


    const toggleEdit = () => setEditMode(!editMode);

    const  logOut= async ()=>{
        await  SecureStore.deleteItemAsync("userSession");
        console.log("logOut");
        router.push("/authentication/login");

    }
    const dispatch = useDispatch();

    const saveProfile = async () => {
        if (isSaving) return; // prevent double taps
        setIsSaving(true); // ✅ set before async work

        const updatedUser = {
            firstName,
            lastName,
            dob,
            email,
            phone: `${phone}`,
        };

        const hasChanged = Object.keys(updatedUser).some(
            (key) => (updatedUser as any)[key] !== (user as any)[key]
        );

        if (!hasChanged) {
            setIsSaving(false);
            setEditMode(false);
            return;
        }

        // 1️⃣ Update Redux
        dispatch(updateUser(updatedUser));

        // 2️⃣ Update SecureStore
        try {
            const currentUser = await SecureStore.getItemAsync("userSession");
            const sessionUser = currentUser ? JSON.parse(currentUser) : {};
            await SecureStore.setItemAsync(
                "userSession",
                JSON.stringify({ ...sessionUser, ...updatedUser })
            );

            // 3️⃣ Update DB
            if (sessionUser.id) {
                await updateRecord(TABLES.USERS, updatedUser, "id = ?", [sessionUser.id]);
            }
        } catch (error) {
            console.log("Error saving profile:", error);
        }

        setIsSaving(false);
        setEditMode(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <ScrollView     keyboardShouldPersistTaps="handled"
                             contentContainerStyle={{ paddingBottom: 100 }}>



                {/* Name */}
                <Text className="text-center text-xl font-[Futura] font-bold m-3">Manage your profile</Text>


                {/* Editable Fields */}
                <View className="space-y-4">
                    {/* Name */}
                    <View className={`flex-row items-center rounded border ${
                        editMode ? "bg-white": "bg-gray-100"
                    } border-gray-200 p-5 m-2`}>
                        <Ionicons name="person" size={22} color="gray" className="mr-2 px-2" />
                        <TextInput
                            value={firstName}
                            onChangeText={setFirstName}
                            editable={editMode}
                            placeholder="Your First Name"
                            className="flex-1 text-1xl py-2 font-[Futura]"
                        />
                    </View>
                    <View className={`flex-row items-center rounded border ${
                        editMode ? "bg-white": "bg-gray-100"
                    } border-gray-200 p-5 m-2`}>
                        <Ionicons name="person" size={22} color="gray" className="mr-2 px-2" />
                        <TextInput
                            value={lastName}
                            onChangeText={setLastName}
                            editable={editMode}
                            placeholder="Your Last Name"
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
                            editable={false}
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
                        onPress={editMode ? saveProfile : toggleEdit}
                        className={`mt-4 p-5 rounded-lg m-2 ${editMode ? "bg-green" : "bg-black"} items-center`}
                        disabled={isSaving} // prevent taps while saving
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text className="text-white font-[FuturaMedium]">
                                {editMode ? "Save" : "Edit Profile"}
                            </Text>
                        )}
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

import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderToolbarProps {
    onBack: () => void;
    onSave: () => void;
    isEditing?: boolean;
}

export default function HeaderToolbar({ onBack, onSave, isEditing }: HeaderToolbarProps) {

    return (
        <View className="flex-row justify-between items-center py-2">
            <TouchableOpacity onPress={onBack} className="p-2">
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-medium font-[Futura]">{isEditing ? "Edit a Schedule" : "Add a Schedule"}</Text>

            <TouchableOpacity onPress={onSave} className="p-2">
                <Text className="font-[Futura] font-bold text-green">
                    {isEditing ? "Update" : "Create"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

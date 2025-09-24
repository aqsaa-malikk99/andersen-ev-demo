import React from "react";
import { View, Pressable, Text } from "react-native";

interface DaySelectorProps {
    selectedDays: string[];
    toggleDay: (day: string) => void;
    days: string[];
}

export default function DaySelector({ selectedDays, toggleDay, days }: DaySelectorProps) {
    return (
        <View className="flex-row flex-wrap mb-3">
            {days.map((day) => (
                <Pressable
                    key={day}
                    onPress={() => toggleDay(day)}
                    className={`px-4 py-2 m-1 rounded-full border font-[Futura] ${
                        selectedDays.includes(day) ? "bg-green border-green" : "bg-gray border-gray"
                    }`}
                >
                    <Text className={selectedDays.includes(day) ? "text-white" : "text-gray"}>
                        {day}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

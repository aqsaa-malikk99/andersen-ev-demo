import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";

interface SliderFieldProps {
    label: string;
    value: number;
    onValueChange: (val: number) => void;
    min: number;
    max: number;
    step: number;
    displayValue?: string;
}

export default function SliderField({ label, value, onValueChange, min, max, step, displayValue }: SliderFieldProps) {
    return (
        <View className="mt-6">
            <Text className="font-[Futura]  text-[17px]">{label}</Text>
            <Slider
                minimumValue={min}
                maximumValue={max}
                step={step}
                value={value}
                onValueChange={onValueChange}
                minimumTrackTintColor="#16a34a"
                maximumTrackTintColor="#d1d5db"
            />
            <Text className="text-gray-600 mb-4 font-[Futura]">{displayValue}</Text>
        </View>
    );
}

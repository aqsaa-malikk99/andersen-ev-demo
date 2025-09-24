import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface TimePickerFieldProps {
    label: string;
    value: Date | null;
    onChange: (date: Date) => void;
    showPicker?: boolean;
    setShowPicker?: (show: boolean) => void;
}

export default function TimePickerField({ label, value, onChange }: TimePickerFieldProps) {
    const [show, setShow] = useState(false);

    const formatTime = (date: Date | null) => {
        if (!date) return "Select time";
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <View className="mt-3">
            <Text className="font-[Futura] mb-2 text-[17px]">{label}</Text>
            <TouchableOpacity
                onPress={() => setShow(true)}
                className="border border-gray-300 rounded-md px-5 py-5 "
            >
                <Text className="font-[Futura] text-[17px]">{formatTime(value)}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={show}
                mode="time"
                onConfirm={(date) => {
                    setShow(false);
                    onChange(date);
                }}
                onCancel={() => setShow(false)}
            />
        </View>
    );
}

import {Text, View, TextInput, TouchableOpacity, ScrollView} from "react-native";
import React, { useState } from "react";
import CountryPicker, {CountryCode} from "react-native-country-picker-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type Field = {
    label: string;
    placeholder?: string;
    secure?: boolean;
    type?: "text" | "password" | "date" | "phone";
};

type AuthCardProps = {
    title: string;
    subtitle: string;
    fields: Field[];
    primaryButtonText: string;
    onPrimaryPress: (formData: Record<string, any>) => void;
    footerText: string;
    footerActionText: string;
    onFooterPress: () => void;
};

export default function AuthCard({
                                     title,
                                     subtitle,
                                     fields,
                                     primaryButtonText,
                                     footerText,
                                     footerActionText,
                                     onPrimaryPress,
                                     onFooterPress,
                                 }: AuthCardProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [countryCode, setCountryCode] = useState("GB"); // default UK
    const [withCallingCode, setWithCallingCode] = useState(true);
    const [showDOB, setShowDOB] = useState(false);

    const [dob, setDOB] = useState<Date | null>(null);
    const updateField = (label: string, value: any) => {
        setFormData((prev) => ({ ...prev, [label]: value }));
    };

    return (



            <View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <View className="bg-green mb-5 rounded-full w-full h-1" />

                {/* Title */}
                <Text className="text-center text-3xl font-[FuturaMedium] font-medium tracking-wider mb-1">
                    ANDERSEN
                </Text>
                <Text className="text-center font-[Futura] text-gray-400 mb-6">
                    SMART CHARGING
                </Text>

                <Text className="text-left font-[Futura] text-1xl text-green mb-3 ">{title}</Text>
                {subtitle && (
                    <Text className="text-left font-[Futura] text-gray-500 mb-6">
                        {subtitle}
                    </Text>
                )}

                {/* Render fields */}
                {fields.map((field, i) => (
                    <View key={i} className="mb-4">
                        <Text className="font-semibold mb-1 font-[Futura]">{field.label}</Text>

                        {field.type === "date" ? (
                            <>
                                <TouchableOpacity
                                    onPress={() => setShowDOB(true)}
                                    className="border border-gray-300 rounded-md px-5 py-5"
                                >
                                    <Text className="font-[Futura]  text-gray-700">
                                        {dob ? dob.toLocaleDateString() : "Select date"}
                                    </Text>
                                </TouchableOpacity>

                                <DateTimePickerModal
                                    isVisible={showDOB}
                                    mode="date"
                                    onConfirm={(date) => {
                                        if (date) {
                                            setDOB(date); // update local state
                                            updateField(field.label, date.toISOString()); // update formData
                                        }
                                        setShowDOB(false);
                                    }}
                                    onCancel={() => setShowDOB(false)}
                                />
                            </>


                        ) : field.type === "phone" ? (
                            <View className="flex-row items-center border border-gray-300 rounded-md px-2 py-3">
                                <CountryPicker
                                    countryCode={countryCode  as CountryCode}
                                    withFilter
                                    withFlag
                                    withCallingCode={withCallingCode}
                                    withAlphaFilter
                                    onSelect={(country) => {
                                        setCountryCode(country.cca2);
                                        updateField("phonePrefix", country.callingCode[0]);
                                    }}
                                />
                                <TextInput
                                    placeholder={field.placeholder}
                                    keyboardType="phone-pad"
                                    className="flex-1 ml-2 font-[Futura]"
                                    onChangeText={(val) => updateField(field.label, val)}
                                />
                            </View>
                        ) : (
                            <TextInput
                                placeholder={field.placeholder}
                                secureTextEntry={field.secure}
                                className="border border-gray-300 rounded-md px-5 py-5 font-[Futura]"
                                onChangeText={(val) => updateField(field.label, val)}
                            />
                        )}
                    </View>
                ))}

                {/* Submit button */}
                <TouchableOpacity
                    className="bg-gray-900 px-5 py-5 rounded-md"
                    onPress={() => onPrimaryPress(formData)}
                >
                    <Text className="text-white text-center font-[Futura] font-semibold">{primaryButtonText}</Text>
                </TouchableOpacity>

                {/* Footer */}
                <View className="flex-row items-center my-4">
                    <View className="flex-1 h-px bg-gray-300" />
                    <Text className="mx-2 text-gray-500 text-sm font-[Futura]">{footerText}</Text>
                    <View className="flex-1 h-px bg-gray-300" />
                </View>

                <TouchableOpacity className="bg-green py-3 rounded-md" onPress={onFooterPress}>
                    <Text className="text-white text-center font-[Futura] font-semibold">{footerActionText}</Text>
                </TouchableOpacity>
            </View>


    );
}

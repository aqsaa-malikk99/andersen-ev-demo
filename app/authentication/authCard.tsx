import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { ReactNode } from "react";

type Field = {
    label: string;
    placeholder: string;
    secure?: boolean;
};

type AuthCardProps = {
    title: string;
    subtitle: string;
    fields: Field[];
    primaryButtonText: string;
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
                                     onFooterPress,
                                 }: AuthCardProps) {
    return (
        <View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <View className="bg-green mb-5 rounded-full w-full h-1" />

            {/* Logo / Title */}
            <Text className="text-center text-3xl font-[FuturaMedium] font-medium tracking-wider mb-1">
                ANDERSEN
            </Text>
            <Text className="text-center font-[Futura] text-gray-400 mb-6">SMART CHARGING</Text>

            {/* Welcome Text */}
            <Text className="text-left font-[Futura] text-1xl text-green mb-6">
                {title}
            </Text>
            {subtitle && (
                <Text className="text-left font-[Futura] text-gray-500 mb-6">
                    {subtitle}
                </Text>
            )}

            {/* Input Fields */}
            {fields.map((field, i) => (
                <View key={i} className="mb-4">
                    <Text className="font-semibold mb-1">{field.label}</Text>
                    <TextInput
                        placeholder={field.placeholder}
                        secureTextEntry={field.secure}
                        className="border border-gray-300 rounded-md px-5 py-5"
                    />
                </View>
            ))}

            {/* Primary Button */}
            <TouchableOpacity className="bg-gray-900 px-5 py-5 rounded-md">
                <Text className="text-white text-center font-semibold">
                    {primaryButtonText}
                </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-2 text-gray-500 text-sm">{footerText}</Text>
                <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Footer Button */}
            <TouchableOpacity className="bg-green py-3 rounded-md" onPress={onFooterPress}>
                <Text className="text-white text-center font-semibold">
                    {footerActionText}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

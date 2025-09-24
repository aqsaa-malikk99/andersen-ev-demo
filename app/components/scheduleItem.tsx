import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type ScheduleItemProps = {
  title: string;
  type: "time" | "charge" | "mileage";
  startTime?: string;
  endTime?: string;
  readyBy?: string;
  chargeLevel?: number;
  mileage?: number;
  activeDays: string[];
  onPress?: () => void;
};

export default function ScheduleItem({
  title,
  type,
  startTime,
  endTime,
  readyBy,
  chargeLevel,
  mileage,
  activeDays,
  onPress,
}: ScheduleItemProps) {
  // Pick gradient colors based on type
  const gradientColors =
    type === "charge"
      ? (["#B0A07D", "#663F00"] as const)
      : type === "mileage"
        ? (["#3A8C9D", "#296875"] as const)
        : (["#7C8985", "#188664"] as const);

  // Pick an icon based on type
  const iconName =
    type === "charge"
      ? "flash-outline"
      : type === "mileage"
        ? "speedometer-outline"
        : "time-outline";
  const formatTime24 = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 15,
          borderRadius: 10,
          marginVertical: 5,
        }}
      >
        <View className="flex-row">
          {/* Left Column */}
          <View className="flex-1 pr-4">
            {/* Title */}
            <Text className="text-white font-[Futura] font-medium text-[25px] mb-3">
              {title}
            </Text>

            {/* Details */}
            {type === "time" && (
              <>
                <Text className="text-gray-100 text-sm mb-1">
                  Start Time - End Time
                </Text>
                <Text className="text-white text-[19px] mb-3">
                  {formatTime24(startTime)} → {formatTime24(endTime)}
                </Text>
              </>
            )}

            {type === "charge" && (
              <>
                <Text className="text-gray-100 text-sm mb-1">Ready By</Text>
                <Text className="text-white text-[19px] mb-2">
                  {formatTime24(readyBy)}
                </Text>
                <Text className="text-gray-100 text-sm mb-1">Charge Level</Text>
                <Text className="text-white text-[19px] mb-3">
                  {chargeLevel?.toFixed(1)}%
                </Text>
              </>
            )}

            {type === "mileage" && (
              <>
                <Text className="text-gray-100 text-sm mb-1">Ready By</Text>
                <Text className="text-white text-[19px] mb-2">
                  {formatTime24(readyBy)}
                </Text>
                <Text className="text-gray-100 text-sm mb-1">Mileage</Text>
                <Text className="text-white text-[19px] mb-3">
                  {mileage?.toFixed(1)} mi
                </Text>
              </>
            )}

            {/* Active Days */}
            <Text className="text-gray-100 text-sm mb-1">Active Days</Text>
            <Text className="text-white text-[19px]">
              {activeDays.join(", ")}
            </Text>
          </View>

          {/* Right Column (Icon fills vertically) */}
          <View className="items-center justify-center">
            <Ionicons name={iconName as any} size={90} color="white" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

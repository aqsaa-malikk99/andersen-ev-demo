import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import Slider from "@react-native-community/slider";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {read} from "fs";


export default function AddSchedule() {
    const router = useRouter();
    const [scheduleName, setScheduleName] = useState("");
    const [scheduleType, setScheduleType] = useState("time");
    const [activeDays, setActiveDays] = useState<string[]>([]);
    const [chargeLevel, setChargeLevel] = useState(50);
    const [mileage, setMileage] = useState(100);

    // Dropdown state
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("time");
    const [items, setItems] = useState([
        { label: "Time Based", value: "time" },
        { label: "Charge Level Based", value: "charge" },
        { label: "Mileage Based", value: "mileage" },
    ]);

    // Time pickers
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);
    const [showReadyTime, setShowReadyTime] = useState(false);

    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [readyTime, setReadyTime] = useState<Date | null>(null);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const toggleDay = (day: string) => {
        if (activeDays.includes(day)) {
            setActiveDays(activeDays.filter((d) => d !== day));
        } else {
            setActiveDays([...activeDays, day]);
        }
    };

    const formatTime = (date: Date | null) => {
        if (!date) return "Select time";
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const handleCreate = () => {
        console.log({
            scheduleName,
            scheduleType: value,
            activeDays,
            chargeLevel,
            mileage,
            startTime,
            endTime,
            readyTime,
        });
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            {/* Toolbar */}
            <View className="flex-row justify-between items-center py-2">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreate} className="p-2">
                    <Text className="text-green font-[Futura]">Create</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text className="text-3xl font-[Futura] font-medium text-green mb-2 mt-2">Add Schedule</Text>
                <Text className="text-gray-500 mb-6">
                    To setup a schedule you need to fill out the following details.
                </Text>

                {/* Schedule Name */}
                <Text className="font-[Futura] mb-2 text-[17px]">Schedule Name</Text>
                <TextInput
                    placeholder="e.g. Weekend Morning Charge"
                    value={scheduleName}
                    onChangeText={setScheduleName}
                    className="border border-gray-300 text-[17px] rounded-md px-5 py-5 mb-7"
                />
                {/* Active Days */}
                <Text className="font-[Futura] mb-2 text-[17px]">Active Days</Text>
                <View className="flex-row flex-wrap mb-6">
                    {days.map((day) => (
                        <Pressable
                            key={day}
                            onPress={() => toggleDay(day)}
                            className={`px-4 py-2 m-1 rounded-full border font-[Futura] ${
                                activeDays.includes(day)
                                    ? "bg-green border-green"
                                    : "bg-gray border-gray"
                            }`}
                        >
                            <Text
                                className={
                                    activeDays.includes(day) ? "text-white" : "text-gray"
                                }
                            >
                                {day}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Schedule Type */}
                <Text className="font-[Futura] mb-2 text-[17px]">Schedule Type</Text>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    listMode={"SCROLLVIEW"}
                    placeholder="Select schedule type"
                    style={{ borderColor: "#d1d5db", paddingHorizontal: 15, paddingVertical: 15, }}
                    textStyle={{fontSize: 17,           // about 17px
                        fontFamily: "Futura",   // apply Futura
                        fontWeight: "300",    }}
                    dropDownContainerStyle={{ borderColor: "#d1d5db" }}

                />


                {/* Conditional Inputs */}
                {value === "time" && (
                    <View className="mb-6">
                        <Text className="font-[Futura] mb-2 text-2xl mt-7 text-[17px]">Start Time</Text>

                        <TouchableOpacity
                            onPress={() => setShowStartTime(true)}
                            className="border border-gray-300 rounded-md px-5 py-5 mb-4"
                        >
                            <Text className="font-[Futura] text-[17px] ">
                                {formatTime(startTime)}
                            </Text>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={showStartTime}
                            mode="time"
                            onConfirm={(date) => {
                                setShowStartTime(false);
                                setStartTime(date);
                            }}
                            onCancel={() => setShowStartTime(false)}
                            // You can control fonts/colors via custom components
                        />


                        <Text className="font-[Futura] mb-2 text-[17px] ">End Time</Text>
                        <TouchableOpacity
                            onPress={() => setShowEndTime(true)}
                            className="border border-gray-300 rounded-md px-5 py-5 mb-4"
                        >
                            <Text className="font-[Futura] text-[17px] ">
                                {formatTime(endTime)}
                            </Text>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={showEndTime}
                            mode="time"
                            onConfirm={(date) => {
                                setShowEndTime(false);
                                setEndTime(date);
                            }}
                            onCancel={() => setShowEndTime(false)}
                            // You can control fonts/colors via custom components
                        />



                    </View>
                )}

                {value === "charge" && (
                    <View className="mb-6">
                        <Text className="font-[Futura] mb-2 text-[17px] mt-7">Charge Level</Text>
                        <Slider
                            minimumValue={0}
                            maximumValue={100}
                            step={0.1}
                            value={chargeLevel}
                            onValueChange={setChargeLevel}
                            minimumTrackTintColor="#16a34a"
                            maximumTrackTintColor="#d1d5db"
                        />
                        <Text className="text-gray-600 mb-4 font-[Futura]">
                            Selected Level: {chargeLevel.toFixed(1)}%
                        </Text>

                        <Text className="font-[Futura] mb-2 text-[17px]">Ready By Time</Text>

                        <TouchableOpacity
                            onPress={() => setShowReadyTime(true)}
                            className="border border-gray-300 rounded-md px-5 py-5 mb-4"
                        >
                            <Text className="font-[Futura] text-[17px] ">
                                {formatTime(readyTime)}
                            </Text>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={showReadyTime}
                            mode="time"
                            onConfirm={(date) => {
                                setShowReadyTime(false);
                                setReadyTime(date);
                            }}
                            onCancel={() => setShowReadyTime(false)}
                            // You can control fonts/colors via custom components
                        />


                    </View>
                )}

                {value === "mileage" && (
                    <View className="mb-6">
                        <Text className="font-[Futura] mb-2 text-[17px] mt-7">Mileage</Text>
                        <Slider
                            minimumValue={0}
                            maximumValue={250}
                            step={1}
                            value={mileage}
                            onValueChange={setMileage}
                            minimumTrackTintColor="#16a34a"
                            maximumTrackTintColor="#d1d5db"
                        />
                        <Text className="text-gray-600 mb-4">
                            Selected Mileage: {mileage} miles
                        </Text>

                        <Text className="font-[Futura] mb-2 text-[17px]">Ready By Time</Text>
                        <TouchableOpacity
                            onPress={() => setShowReadyTime(true)}
                            className="border border-gray-300 rounded-md px-5 py-5 mb-4"
                        >
                            <Text className="font-[Futura] text-[17px] ">
                                {formatTime(readyTime)}
                            </Text>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={showReadyTime}
                            mode="time"
                            onConfirm={(date) => {
                                setShowReadyTime(false);
                                setReadyTime(date);
                            }}
                            onCancel={() => setShowReadyTime(false)}
                            // You can control fonts/colors via custom components
                        />

                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

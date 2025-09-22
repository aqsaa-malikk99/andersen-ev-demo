import React, {useEffect, useState} from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import Slider from "@react-native-community/slider";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {read} from "fs";
import {getScheduleById, Schedule} from "@/app/models/schedule";
import { useLocalSearchParams } from 'expo-router';
import {RootState} from "@/app/store";
import {useSelector} from "react-redux";


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
    const currentUser = useSelector((state: RootState) => state.user.user);
    const userId = currentUser?.id; // this is the ID you need

    const[titlePage,setTitlePage] = useState("Add Schedule");
    const[subtitlePage,setSubTitlePage] = useState("To setup a schedule you need to fill out the following details");
    // Time pickers
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);
    const [showReadyTime, setShowReadyTime] = useState(false);

    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [readyTime, setReadyTime] = useState<Date | null>(null);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const { scheduleId } = useLocalSearchParams<{ scheduleId?: string }>();

    const[editingSchedule,setEditingSchedule] = useState<Schedule|null>(null);


    useEffect(() => {
        if (scheduleId) {
            (async () => {
                const schedule = await getScheduleById(scheduleId);
                if (schedule) {
                    setEditingSchedule(schedule);
                    setTitlePage('Edit Schedule');
                    setSubTitlePage('You cannot change the type of schedule here instead create a new Schedule');
                    setScheduleName(schedule.title);
                    setActiveDays(schedule.activeDays);
                    setValue(schedule.type); // type is fixed
                    if (schedule.startTime) setStartTime(new Date(schedule.startTime));
                    if (schedule.endTime) setEndTime(new Date(schedule.endTime));
                    if (schedule.readyBy) setReadyTime(new Date(schedule.readyBy));
                    if (schedule.chargeLevel) setChargeLevel(schedule.chargeLevel);
                    if (schedule.mileage) setMileage(schedule.mileage);
                }
            })();
        }
    }, [scheduleId]);

    const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const toggleDay = (day: string) => {
        let updatedDays = [];
        if (activeDays.includes(day)) {
            updatedDays = activeDays.filter((d) => d !== day);
        } else {
            updatedDays = [...activeDays, day];
        }
        // Sort according to week order
        updatedDays.sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));
        setActiveDays(updatedDays);
    };



    const formatTime = (date: Date | null) => {
        if (!date) return "Select time";
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };
// Inside your component, after handleCreate function

    const handleDelete = async () => {
        if (!editingSchedule) return;
        try {
            await editingSchedule.delete(); // make sure your Schedule class has a delete() method
            router.back();
        } catch (err) {
            console.log("Failed to delete schedule:", err);
        }
    };

    const handleCreate = async () => {
        try {
            if (!userId) {
                console.log("No logged-in user ID found!");
                return;
            }
            if (editingSchedule) {
                // Update existing schedule
                editingSchedule.title = scheduleName;
                editingSchedule.activeDays = activeDays;
                editingSchedule.startTime = startTime?.toISOString();
                editingSchedule.endTime = endTime?.toISOString();
                editingSchedule.readyBy = readyTime?.toISOString();
                editingSchedule.chargeLevel = value === "charge" ? chargeLevel : undefined;
                editingSchedule.mileage = value === "mileage" ? mileage : undefined;

                await editingSchedule.update();
            } else {
                // Create new schedule
                const newSchedule = new Schedule({
                    title: scheduleName,
                    userId:currentUser?.id,
                    type: value as "time" | "charge" | "mileage",
                    startTime: startTime?.toISOString(),
                    endTime: endTime?.toISOString(),
                    readyBy: readyTime?.toISOString(),
                    chargeLevel: value === "charge" ? chargeLevel : undefined,
                    mileage: value === "mileage" ? mileage : undefined,
                    activeDays,
                });

                await newSchedule.save();
            }

            router.back();
        } catch (err) {
            console.log("Failed to save schedule:", err);
        }
    };



    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            {/* Toolbar */}
            <View className="flex-row justify-between items-center py-2">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreate} className="p-2">
                    <Text className={`font-[Futura]  font-bold ${editingSchedule ? "text-green" : "text-green"}`}>
                        {editingSchedule ? "Update" : "Create"}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text className="text-3xl font-[Futura] font-medium text-green mb-2 mt-2">{titlePage}</Text>
                <Text className="text-gray-500 mb-6">
                    {subtitlePage}
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
                    disabled={!!editingSchedule}
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
                {editingSchedule && (
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="p-5 rounded-lg border border-red-500 items-center"

                    >
                        <Text className="text-red-500 font-[FuturaMedium]">
                           Delete Schedule
                        </Text>
                    </TouchableOpacity>
                )}


            </ScrollView>
        </SafeAreaView>
    );
}

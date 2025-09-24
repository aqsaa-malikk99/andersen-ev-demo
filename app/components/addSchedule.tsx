import wReact, { useEffect, useState } from "react";
import {ScrollView, Text, TouchableOpacity, Alert, TextInput} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Schedule, getScheduleById } from "@/app/models/schedule";
import HeaderToolbar from "@/app/components/HeaderToolbar";
import TimePickerField from "@/app/components/TimePickerField";
import SliderField from "@/app/components/SliderField";
import DaySelector from "@/app/components/DaySelector";
import {SafeAreaView} from "react-native-safe-area-context";
import ScheduleTypeDropdown from "@/app/components/ScheduleTypeDropdown";

export default function AddSchedule() {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.user.user);
    const userId = currentUser?.id;

    const { scheduleId } = useLocalSearchParams<{ scheduleId?: string }>();

    const [scheduleName, setScheduleName] = useState("");
    const [activeDays, setActiveDays] = useState<string[]>([]);
    const [value, setValue] = useState("time"); // schedule type
    const [chargeLevel, setChargeLevel] = useState(50);
    const [mileage, setMileage] = useState(100);

    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [readyTime, setReadyTime] = useState<Date | null>(null);

    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: "Time Based", value: "time" },
        { label: "Charge Level Based", value: "charge" },
        { label: "Mileage Based", value: "mileage" },
    ]);
    const handleDelete = async () => {
        if (!editingSchedule) return;
        try {
            await editingSchedule.delete(); // make sure your Schedule class has a delete() method
            router.back();
        } catch (err) {
            console.log("Failed to delete schedule:", err);
        }
    };
    useEffect(() => {
        if (scheduleId) {
            (async () => {
                const schedule = await getScheduleById(scheduleId);
                if (schedule) {
                    setEditingSchedule(schedule);
                    setScheduleName(schedule.title);
                    setActiveDays(schedule.activeDays);
                    setValue(schedule.type);
                    if (schedule.startTime) setStartTime(new Date(schedule.startTime));
                    if (schedule.endTime) setEndTime(new Date(schedule.endTime));
                    if (schedule.readyBy) setReadyTime(new Date(schedule.readyBy));
                    if (schedule.chargeLevel) setChargeLevel(schedule.chargeLevel);
                    if (schedule.mileage) setMileage(schedule.mileage);
                }
            })();
        }
    }, [scheduleId]);

    const validate = (): boolean => {
        if (!scheduleName.trim()) {
            Alert.alert("Validation Error", "Schedule Name cannot be empty");
            return false;
        }
        if (activeDays.length === 0) {
            Alert.alert("Validation Error", "Please select at least one active day");
            return false;
        }
        if (value === "time" && (!startTime || !endTime)) {
            Alert.alert("Validation Error", "Please select start and end times");
            return false;
        }
        return true;
    };

    const handleCreate = async () => {
        if (!userId || !validate()) return;

        try {
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
                    userId,
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
        <SafeAreaView className="flex-1 bg-white px-4 p-4">
            {/* Header */}
            <HeaderToolbar
                onBack={() => router.back()}
                onSave={handleCreate}
                isEditing={!!editingSchedule}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="font-[Futura] mb-2 text-[17px] mt-4">Schedule Name</Text>
                <TextInput
                    placeholder="e.g. Weekend Morning Charge"
                    value={scheduleName}
                    onChangeText={setScheduleName}
                    className="border border-gray-300 text-[17px] rounded-md px-5 py-5 mb-3"
                />
                <Text className="font-[Futura] mb-2 text-[17px]">Active Days</Text>
                <DaySelector selectedDays={activeDays} toggleDay={(day) => {
                    let updatedDays = activeDays.includes(day)
                        ? activeDays.filter(d => d !== day)
                        : [...activeDays, day];
                    setActiveDays(updatedDays);
                }} days={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} />
                <Text className="font-[Futura] mb-3 text-[17px]">Select Type of Charge</Text>
                <ScheduleTypeDropdown
                    value={value}
                    setValue={setValue}
                    open={open}
                    setOpen={setOpen}
                    items={items}
                    setItems={setItems}
                    disabled={!!editingSchedule}
                />

                {value === "time" && (
                    <>
                        <TimePickerField
                            label="Start Time"
                            value={startTime}
                            onChange={setStartTime}
                            showPicker={!!startTime}
                            setShowPicker={() => {}}
                        />
                        <TimePickerField
                            label="End Time"
                            value={endTime}
                            onChange={setEndTime}
                            showPicker={!!endTime}
                            setShowPicker={() => {}}
                        />
                    </>
                )}

                {value === "charge" && (
                    <>
                        <SliderField
                            label="Charge Level"
                            value={chargeLevel}
                            onValueChange={setChargeLevel}
                            min={0} max={100} step={0.1}
                            displayValue={`${chargeLevel.toFixed(1)}%`}
                        />
                    </>
                )}

                {value === "mileage" && (
                    <>
                        <SliderField
                            label="Mileage"
                            value={mileage}
                            onValueChange={setMileage}
                            min={0} max={250} step={1}
                            displayValue={`${mileage} miles`}
                        />


                    </>
                )}

                {(value === "charge" || value === "mileage") && (
                    <TimePickerField
                        label="Ready By"
                        value={readyTime}
                        onChange={setReadyTime}
                        showPicker={!!readyTime}
                        setShowPicker={() => {}}
                    />
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

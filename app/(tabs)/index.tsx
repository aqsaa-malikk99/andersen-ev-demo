import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ScheduleItem from "@/app/scheduleItem";

// Sample data
const scheduleData = [
    {
        id: 1,
        title: "Morning Charge",
        type: "time",
        startTime: "09:00",
        endTime: "13:00",
        activeDays: ["Wednesday", "Thursday", "Friday"],
    },
    {
        id: 2,
        title: "Workday Prep",
        type: "charge",
        readyBy: "07:00",
        chargeLevel: 80,
        activeDays: ["Monday", "Tuesday"],
    },
    {
        id: 3,
        title: "Weekend Trip",
        type: "mileage",
        readyBy: "08:30",
        mileage: 180,
        activeDays: ["Saturday", "Sunday"],
    },
];

export default function MainPage() {
    const router = useRouter();

    const renderScheduleItem = ({ item }: any) => {
        return (
            <ScheduleItem
                title={item.title}
                type={item.type}
                startTime={item.startTime}
                endTime={item.endTime}
                readyBy={item.readyBy}
                chargeLevel={item.chargeLevel}
                mileage={item.mileage}
                activeDays={item.activeDays}
            />
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white mt-2 p-7">
            {/* Greeting */}
            <Text className="font-[Futura] text-5xl mt-5 text-green mb-1">
                Hello, Andrews
            </Text>
            <Text className="text-1xl text-gray-400 mb-5">
                Your charging schedules are below
            </Text>

            {/* Schedule List */}
            <FlatList
                data={scheduleData}
                renderItem={renderScheduleItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                onPress={() => router.push("./addSchedule")}
                className="absolute bottom-10 right-10 bg-green p-4 rounded-full shadow-lg"
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

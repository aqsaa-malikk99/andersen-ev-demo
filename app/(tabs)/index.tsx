// app/(tabs)/index.tsx
import { Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import useSchedules from "@/app/hooks/useSchedules";
import ScheduleItemWrapper from "@/app/components/ScheduleItemWrapper";
import { useRouter} from "expo-router";

export default function MainPage() {
    const user = useSelector((state: RootState) => state.user.user);
    const { schedules, canAddSchedule } = useSchedules(user?.id);
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white px-7 pt-7">
            <Text className="font-[Futura] text-5xl mt-5 text-green mb-1" style={{ lineHeight: 60 }}>
                Hello, {user?.firstName}
            </Text>
            <Text className="text-1xl text-gray-400 mb-5">
                Your charging schedules are below
            </Text>

            <FlatList
                data={schedules}
                renderItem={({ item }) => <ScheduleItemWrapper item={item} />}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 0 }}
            />

            {canAddSchedule && (
                <TouchableOpacity
                    onPress={() => router.push("./components/addSchedule")}
                    className="absolute bottom-10 right-10 bg-green p-4 rounded-full shadow-lg"
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

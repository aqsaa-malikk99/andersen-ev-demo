import { Text, TouchableOpacity, FlatList } from "react-native";
import {useFocusEffect, useRouter} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ScheduleItem from "@/app/components/scheduleItem";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {useCallback, useEffect, useState} from "react";
import {getScheduleById, getSchedules, Schedule} from "@/app/models/schedule";
import {SCHEDULE_LIMIT} from "@/app/constants/scheduleLimit";

export default function MainPage() {

    // const user= await SecureStore.getItemAsync("userSession");
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user);
    const [schedules, setSchedules] = useState<Schedule[]|null>([]);
    const [canAddSchedule, setCanAddSchedule] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchSchedules = async () => {
                if (user?.id) {
                    const data = await getSchedules(user.id.toString());
                    if (isActive){
                        setSchedules(data);
                        setCanAddSchedule(data.length<SCHEDULE_LIMIT)

                    }; // only update if still focused
                }
            };

            fetchSchedules();

            return () => {
                isActive = false; // cleanup if screen is unfocused
            };
        }, [user])
    );
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
                onPress={() => router.push(`./components/addSchedule?scheduleId=${item.id}`)} // ✅ pass ID

            />
        );
    };


    return (

        <SafeAreaView className="flex-1 bg-white px-7 pt-7">
            {/* notice px-7 pt-7 instead of p-7 */}


            {/* Greeting */}
            <Text
                className="font-[Futura] text-5xl mt-5 text-green mb-1"
                style={{ lineHeight: 60 }} // adjust slightly above font size
            >
                Hello, {user?.firstName}
            </Text>
            <Text className="text-1xl text-gray-400 mb-5">
                Your charging schedules are below
            </Text>

            {/* Schedule List */}
            <FlatList
                data={schedules}
                renderItem={renderScheduleItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 0 }} // 👈 removes extra bottom space
            />

            {/* Floating Action Button */}
            {canAddSchedule &&<TouchableOpacity
                onPress={() => router.push("./components/addSchedule")}
                className="absolute bottom-10 right-10 bg-green p-4 rounded-full shadow-lg"
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>}


        </SafeAreaView>
    );
}

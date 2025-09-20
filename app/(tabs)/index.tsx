import {View, Text, TouchableOpacity, FlatList,} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const scheduleData=[
    {id:1,title:"Schedule 1", starttime:'10:00',endtime:'10:00',activeDate:'Wednesday, Thursday, Friday',type:'charging'},
    {id:3,title:"Schedule 3", starttime:'10:00',endtime:'10:00',activeDate:'Wednesday, Thursday, Friday',type:'charging'},
    {id:4,title:"Schedule 4", starttime:'10:00',endtime:'10:00',activeDate:'Wednesday, Thursday, Friday',type:'charging'},
];
export default function MainPage() {
    const router = useRouter();

    const renderScheduleItem=({item}:any)=>{
        return (
            <View className="mb-4">
                {/* Placeholder for the LinearGradientCard component */}
                <Text className="text-lg">{item.title} - {item.starttime}</Text>
            </View>
        );
    }
    return (

            <SafeAreaView className="flex-1 bg-white  mt-2 p-7">
                {/*<Text className="text-center text-2xl font-[FuturaMedium] font-medium tracking-wider mb-1">
                    ANDERSEN
                </Text>
                <Text className="text-center font-[Futura] text-sm text-gray-400 mt-1 mb-5">
                    SMART CHARGING
                </Text>

                 Divider
                <View className={`h-[1] bg-grayLight mb-5`} />*/}

                {/* Greeting */}
                <Text className={` font-[Futura] text-5xl mt-5 text-green mb-1`}>
                    Hello, Andrews
                </Text>
                <Text className="text-1xl  text-gray-400 mb-5">
                    Your charging schedules are below
                </Text>

                {/* Schedule List */}
                <FlatList
                    data={scheduleData}
                    renderItem={renderScheduleItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 100 }} // ensure FAB doesn't cover last item
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

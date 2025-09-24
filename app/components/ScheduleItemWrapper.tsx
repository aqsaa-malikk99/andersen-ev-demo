// app/components/ScheduleItemWrapper.tsx
import React from "react";
import { Schedule } from "@/app/models/schedule";
import ScheduleItem from "@/app/components/scheduleItem";
import { useRouter } from "expo-router";

type Props = {
    item: Schedule;
};

export default function ScheduleItemWrapper({ item }: Props) {
    const router = useRouter();

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
            onPress={() => router.push(`./components/addSchedule?scheduleId=${item.id}`)}
        />
    );
}

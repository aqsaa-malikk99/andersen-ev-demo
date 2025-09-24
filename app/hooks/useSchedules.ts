// app/hooks/useSchedules.ts
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getSchedules, Schedule } from "@/app/models/schedule";
import { SCHEDULE_LIMIT } from "@/app/constants/scheduleLimit";

export default function useSchedules(userId: number | undefined) {
    const [schedules, setSchedules] = useState<Schedule[] | null>([]);
    const [canAddSchedule, setCanAddSchedule] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchSchedules = async () => {
                if (!userId) return;

                const data = await getSchedules(userId.toString());
                if (isActive) {
                    setSchedules(data);
                    setCanAddSchedule(data.length < SCHEDULE_LIMIT);
                }
            };

            fetchSchedules();

            return () => {
                isActive = false;
            };
        }, [userId])
    );

    return { schedules, canAddSchedule };
}

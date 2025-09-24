import {
  createRecord,
  readRecords,
  updateRecord,
  deleteRecord,
} from "@/app/db/crud";
import { TABLES } from "@/app/constants/table";

export interface ScheduleData {
  id?: string; // unique ID
  title: string;
  userId: number; // <-- required

  type: "time" | "charge" | "mileage";
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  readyBy?: string; // ISO string
  chargeLevel?: number;
  mileage?: number;
  activeDays: string[];
}

export class Schedule {
  public id: string;
  public title: string;
  public userId: number; // <-- add this

  public type: "time" | "charge" | "mileage";
  public startTime?: string;
  public endTime?: string;
  public readyBy?: string;
  public chargeLevel?: number;
  public mileage?: number;
  public activeDays: string[];

  constructor(data: ScheduleData) {
    this.id = data.id ?? Date.now().toString();
    this.userId = data.userId; // <-- assign

    this.title = data.title;
    this.type = data.type;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.readyBy = data.readyBy;
    this.chargeLevel = data.chargeLevel;
    this.mileage = data.mileage;
    this.activeDays = data.activeDays;
  }

  // Save new schedule
  public async save() {
    await createRecord(TABLES.SCHEDULES, {
      id: this.id,
      userId: this.userId,
      title: this.title,
      type: this.type,
      startTime: this.startTime,
      endTime: this.endTime,
      readyBy: this.readyBy,
      chargeLevel: this.chargeLevel,
      mileage: this.mileage,
      activeDays: JSON.stringify(this.activeDays),
    });
  }

  // Update existing schedule
  public async update() {
    await updateRecord(
      TABLES.SCHEDULES,
      {
        title: this.title,
        userId: this.userId,
        type: this.type,
        startTime: this.startTime,
        endTime: this.endTime,
        readyBy: this.readyBy,
        chargeLevel: this.chargeLevel,
        mileage: this.mileage,
        activeDays: JSON.stringify(this.activeDays),
      },
      "id = ?",
      [this.id]
    );
  }

  // Delete schedule
  public async delete() {
    await deleteRecord(TABLES.SCHEDULES, "id = ?", [this.id]);
  }
}

// Fetch all schedules
export async function getSchedules(userId: string): Promise<Schedule[]> {
  const records = (await readRecords(TABLES.SCHEDULES, "userId = ?", [
    userId,
  ])) as ScheduleData[];
  return records.map(
    (rec) =>
      new Schedule({
        ...rec,
        activeDays: rec.activeDays
          ? JSON.parse(
              typeof rec.activeDays === "string" ? rec.activeDays : "[]"
            )
          : [],
      })
  );
}

// Fetch single schedule by ID
export async function getScheduleById(id: string): Promise<Schedule | null> {
  const records = (await readRecords(TABLES.SCHEDULES, "id = ?", [
    id,
  ])) as ScheduleData[];
  if (!records.length) return null;
  const rec = records[0];
  return new Schedule({
    ...rec,
    activeDays: rec.activeDays
      ? JSON.parse(typeof rec.activeDays === "string" ? rec.activeDays : "[]")
      : [],
  });
}

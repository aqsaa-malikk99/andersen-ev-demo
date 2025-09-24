import * as SQLite from "expo-sqlite";
import { TABLES } from "@/app/constants/table";

export async function runMigrations(db: SQLite.SQLiteDatabase) {

  await db.execAsync(
    `
            CREATE TABLE IF NOT EXISTS users
            (
                id TEXT PRIMARY KEY,
                firstName TEXT,
                lastName TEXT,
                email TEXT UNIQUE,
                password TEXT,
                dob TEXT,
                phone TEXT
            );


        `
  );

  // Schedules table
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${TABLES.SCHEDULES} (  id TEXT PRIMARY KEY,           -- matches Schedule.id as string
                                                           userId INTEGER NOT NULL,       -- foreign key to USERS table
                                                           title TEXT NOT NULL,           -- scheduleName / title
                                                           type TEXT NOT NULL,            -- "time", "charge", or "mileage"
                                                           startTime TEXT,                -- ISO string, nullable
                                                           endTime TEXT,                  -- ISO string, nullable
                                                           readyBy TEXT,                  -- ISO string, nullable
                                                           chargeLevel REAL,              -- nullable
                                                           mileage REAL,                  -- nullable
                                                           activeDays TEXT,               -- JSON array of strings
                                                           FOREIGN KEY(userId) REFERENCES ${TABLES.USERS}(id)
            );
    `);
}

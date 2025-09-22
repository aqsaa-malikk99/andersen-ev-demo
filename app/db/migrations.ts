import * as SQLite from "expo-sqlite";
import {TABLES} from "@/app/constants/table";

export async function runMigrations(db:SQLite.SQLiteDatabase) {


    await db.execAsync(
        `
    CREATE TABLE IF NOT EXISTS ${TABLES.USERS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      dob TEXT,
      phone TEXT
    );

  `
    );

    // Schedules table
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${TABLES.SCHEDULES} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY(userId) REFERENCES ${TABLES.USERS}(id)
    );
  `);
}
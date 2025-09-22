import * as SQLite from "expo-sqlite";
import { getDB } from "./database";
import {TABLES} from "@/app/constants/table";

// Type definition for a generic record
type Record = {
    [key: string]: any;
};

// Create a new record
export async function createRecord(table: TABLES, data: Record) {
    const db = await getDB();
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map(() => "?").join(", ");
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders});`;
    await db.runAsync(query, values);
    console.log(`Record created in ${table} table`);
}

// Read records (all or by a specific condition)
export async function readRecords(table: TABLES, condition?: string, params?: any[]) {
    const db = await getDB();
    const query = condition ? `SELECT * FROM ${table} WHERE ${condition};` : `SELECT * FROM ${table};`;
    const result = await db.getAllAsync(query, params ?? []);
    return result;
}
// Update a record
export async function updateRecord(table: TABLES, data: Record, condition: string, params: any[]) {
    const db = await getDB();
    const updates = Object.keys(data).map(key => `${key} = ?`).join(", ");
    const values = Object.values(data);
    const query = `UPDATE ${table} SET ${updates} WHERE ${condition};`;
    await db.runAsync(query, [...values, ...params]);
    console.log(`Record updated in ${table} table`);
}

// Delete a record
export async function deleteRecord(table: TABLES, condition: string, params: any[]) {
    const db = await getDB();
    const query = `DELETE FROM ${table} WHERE ${condition};`;
    await db.runAsync(query, params);
    console.log(`Record deleted from ${table} table`);
}
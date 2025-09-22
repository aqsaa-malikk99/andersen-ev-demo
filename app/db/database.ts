import * as SQLite from "expo-sqlite";
import {runMigrations} from "@/app/db/migrations";

const DB_NAME="andersenevDB.db";
let db:SQLite.SQLiteDatabase|null = null;

export async function getDB(){
    if(!db){
        db=await SQLite.openDatabaseAsync(DB_NAME);
        runMigrations(db);
    }
    return db;
}


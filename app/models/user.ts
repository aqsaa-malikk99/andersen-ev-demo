import { createRecord, readRecords } from "@/app/db/crud";
import { TABLES } from "@/app/constants/table";

export interface UserData {
    firstName?: string;
    lastName?: string;
    dob?: string;
    phone?: string;
    email: string;
    password: string;
    id?: string; // Unique ID for session
}

export class User {
    public name: string;
    public email: string;
    public password: string;
    public dob?: string;
    public phone?: string;
    public id: string;

    constructor(data: UserData) {
        this.name = data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : "";
        this.email = data.email;
        this.password = data.password;
        this.dob = data.dob;
        this.phone = data.phone;
        this.id = Date.now().toString(); // Simple unique ID
    }

    public async save() {
        const { name, email, password, dob, phone, id } = this;
        await createRecord(TABLES.USERS, { name, email, password, dob, phone, id });
    }
}

export async function registerUser(data: UserData) {
    try {
        const existingUsers = await readRecords(TABLES.USERS, "email = ?", [data.email]);
        if (existingUsers.length > 0) throw new Error("User with this email already exists.");

        const user = new User(data);
        await user.save();
        return user; // Return user with ID
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

export async function loginUser(email: string, password: string) {
    try {
        const users = await readRecords(TABLES.USERS, "email = ?", [email]);
        if (!users.length) throw new Error("Invalid email or password.");

        const user = users[0] as UserData;
        if (user.password === password) { // simple client-side check
            return user; // Include ID for session
        }
        throw new Error("Invalid email or password.");
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

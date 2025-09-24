import {
  createRecord,
  readRecords,
  updateRecord,
  deleteRecord,
} from "@/app/db/crud";
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
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public dob?: string;
  public phone?: string;
  public id: string;

  constructor(data: UserData) {
    this.firstName = data.firstName ?? "";
    this.lastName = data.lastName ?? "";
    this.email = data.email;
    this.password = data.password;
    this.dob = data.dob;
    this.phone = data.phone;
    this.id = Date.now().toString();
  }

  public async save() {
    const { firstName, lastName, email, password, dob, phone, id } = this;
    await createRecord(TABLES.USERS, {
      firstName,
      lastName,
      email,
      password,
      dob,
      phone,
      id,
    });
  }
}

export async function registerUser(data: UserData) {
  const existingUsers = await readRecords(TABLES.USERS, "email = ?", [
    data.email,
  ]);
  if (existingUsers.length > 0)
    throw new Error("User with this email already exists.");

  const user = new User(data);
  await user.save();
  return user;
}

export async function loginUser(email: string, password: string) {
  const users = await readRecords(TABLES.USERS, "email = ?", [email]);
  if (!users.length) throw new Error("Invalid email or password.");

  const user = users[0] as UserData;
  if (user.password === password) {
    return user;
  }
  throw new Error("Invalid email or password.");
}

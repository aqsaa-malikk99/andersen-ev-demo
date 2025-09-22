import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
    dob: string;
    phone: string;
    password?: string;
}

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export const userReducer = userSlice.reducer;

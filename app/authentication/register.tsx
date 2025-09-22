import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {router, useRouter} from "expo-router";
import AuthCard from "./authCard";
import {registerUser, UserData} from "@/app/models/user";
import * as SecureStore from 'expo-secure-store';
import {setUser, User} from "@/app/store/userSlice";
import {useDispatch} from "react-redux";

export default function Register() {
    const router = useRouter();


    const dispatch = useDispatch();

     function validate(formData: Record<string, any>): boolean {
        // Correctly match the property names from the formData object
        const {
            "First Name": firstName,
            "Last Name": lastName,
            "Date of Birth": dateOfBirth,
            "Phone": phone,
            "Email": email,
            "Password": password,
            "Retype Password": retypePassword
        } = formData;

        console.log("Registering user:", JSON.stringify(formData, null, 2));

        // Check for empty fields
        if (!firstName || !lastName || !dateOfBirth || !phone || !email || !password || !retypePassword) {
            Alert.alert("Error", "Please fill out all the details.");
            return false;
        }

        // Password length validation
        if (password.length < 8) {
            Alert.alert("Error", "Password must be at least 8 characters long.");
            return false;
        }

        // Password match validation
        if (password !== retypePassword) {
            Alert.alert("Error", "Passwords do not match.");
            return false;
        }

        // Email format validation using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return false;
        }

        // Phone number validation (optional, can add more checks)
        if (phone.length < 10) {
            Alert.alert("Error", "Please enter a valid phone number.");
            return false;
        }

        // All validations passed
        return true;
    }
    const handleRegister = async (formData: Record<string, any>) => {
        try {
            console.log("Registering user:", JSON.stringify(formData, null, 2));


            if(validate(formData)) {
                // Map formData to UserData
                const userData: UserData = {
                    firstName: formData["First Name"] || "",
                    lastName: formData["Last Name"] || "",
                    dob: formData["Date of Birth"] ? new Date(formData["Date of Birth"]).toISOString() : "",
                    phone: formData["Phone"] || "",
                    email: formData["Email"] || "",
                    password: formData["Password"]?.toString() || "", // <-- force string
                };


                console.log("Registering user:", JSON.stringify(userData, null, 2));
                // Call your registerUser function
                const user= await registerUser(userData);


                if(user) {
                    const mappedUser: User = {
                        id: user.id ? Number(user.id) : 0,  // fallback to 0 if missing
                        firstName: user.firstName ?? "",
                        lastName: user.lastName ?? "",
                        email: user.email,
                        dob: user.dob ?? "",
                        phone: user.phone ?? "",
                    };

                    await SecureStore.setItemAsync("userSession", JSON.stringify(mappedUser));
                    dispatch(setUser(mappedUser));

                    router.replace("/(tabs)");
                    Alert.alert("Success", "Login successful!", [
                        {text: "OK", onPress: () => router.replace("/(tabs)")},
                    ]);
                }
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to register user.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 justify-center items-center px-4">
                    <AuthCard
                        title="Create your account"
                        subtitle=""
                        fields={[
                            { label: "First Name", placeholder: "Enter your first name", type: "text" },
                            { label: "Last Name", placeholder: "Enter your last name", type: "text" },
                            { label: "Date of Birth", type: "date" },
                            { label: "Phone", placeholder: "Enter phone number", type: "phone" },
                            { label: "Email", placeholder: "Enter your email", type: "text" },
                            { label: "Password", placeholder: "Enter your password", secure: true, type: "password" },
                            { label: "Retype Password", placeholder: "Retype your password", secure: true, type: "password" },
                        ]}
                        primaryButtonText="Register"
                        footerText="Already have an account?"
                        footerActionText="Login"
                        onPrimaryPress={handleRegister} // pass here
                        onFooterPress={() => router.push("/authentication/login")}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

import { View } from "react-native";
import {router, useRouter} from "expo-router";
import AuthCard from "./authCard";

export default function Register() {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center bg-gray-100 px-4">
            <AuthCard
                title="Welcome to Andersen EV Charge Scheduler"
                subtitle=""
                fields={[
                    { label: "Email", placeholder: "Enter your email" },
                    { label: "Password", placeholder: "Enter your password", secure: true },
                    { label: "Re type your password", placeholder: "Enter your password", secure: true },
                ]}
                primaryButtonText="Register"
                footerText="Already a member?"
                footerActionText="Login"
                onPrimaryPress={()=> router.push("/(tabs)")}
                onFooterPress={() => router.push("/authentication/login")}
            />
        </View>
    );
}

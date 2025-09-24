import { Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { Link, router } from "expo-router";
import "../../global.css";
import AuthCard from "@/app/authentication/authCard";
import { loginUser, UserData } from "@/app/models/user";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { setUser, User } from "@/app/store/userSlice";

export default function Login() {
  const dispatch = useDispatch();

  function validate(formData: Record<string, any>): boolean {
    const email = formData["Email"] ?? "";
    const password = formData["Password"] ?? "";

    if (!email || !password) {
      Alert.alert("Error", "Please fill out all the details.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }

    return true;
  }
  const handleLogin = async (formData: Record<string, any>): Promise<void> => {
    try {
      if (validate(formData)) {
        const user = await loginUser(formData["Email"], formData["Password"]);

        console.log("found user", user);
        if (user) {
          // Map DB user to Redux User type
          const mappedUser: User = {
            id: user.id ? Number(user.id) : 0,
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            email: user.email,
            dob: user.dob ?? "",
            phone: user.phone ?? "",
          };

          await SecureStore.setItemAsync(
            "userSession",
            JSON.stringify(mappedUser)
          );
          dispatch(setUser(mappedUser));

          Alert.alert("Success", "Login successful!", [
            { text: "OK", onPress: () => router.replace("/(tabs)") },
          ]);
        }
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to register user.");
    }
  };
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-4">
      <AuthCard
        title="Welcome to Andersen EV Charge Scheduler"
        subtitle=""
        fields={[
          { label: "Email", placeholder: "Enter your email" },
          {
            label: "Password",
            placeholder: "Enter your password",
            secure: true,
          },
        ]}
        primaryButtonText="Sign in"
        footerText="Not a member?"
        footerActionText="Register"
        onPrimaryPress={handleLogin}
        onFooterPress={() => router.push("/authentication/register")}
      />
    </View>

  );
}

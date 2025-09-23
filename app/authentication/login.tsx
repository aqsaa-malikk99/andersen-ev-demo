import {Text, View, TouchableOpacity, TextInput, Alert} from "react-native";
import {Link, router} from "expo-router";
import "../../global.css";
import AuthCard from "@/app/authentication/authCard";
import {loginUser, UserData} from "@/app/models/user";
import * as SecureStore from 'expo-secure-store';
import {useDispatch} from "react-redux";
import {setUser, User} from "@/app/store/userSlice";

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
    const handleLogin=async (formData:Record<string,any>):Promise<void>=>{
       try{
           if(validate(formData)) {
               const user = await loginUser(formData["Email"], formData["Password"]);

               console.log("found user",user);
               if (user) {
                   // Map DB user to Redux User type
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

                   Alert.alert("Success", "Login successful!", [
                       { text: "OK", onPress: () => router.replace("/(tabs)") },
                   ]);
               }
           }


       }catch (error: any) {
           Alert.alert("Error", error.message || "Failed to register user.");
       }
    }
    return (

        <View className="flex-1 items-center justify-center bg-gray-100 px-4">
            <AuthCard
                title="Welcome to Andersen EV Charge Scheduler"
                subtitle=""
                fields={[
                    { label: "Email", placeholder: "Enter your email" },
                    { label: "Password", placeholder: "Enter your password", secure: true },
                ]}
                primaryButtonText="Sign in"
                footerText="Not a member?"
                footerActionText="Register"
                onPrimaryPress={handleLogin}
                onFooterPress={() => router.push("/authentication/register")}
            />
        </View>
  /*      <View className="flex-1 items-center justify-center bg-gray-100 px-4">

            {/!* Card Container *!/}
            <View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <View className="bg-green mb-5 rounded-full w-full h-1" />

                {/!* Logo / Title *!/}
                <Text className="text-center text-3xl font-[FuturaMedium] font-medium tracking-wider mb-1">
                    ANDERSEN
                </Text>
                <Text className="text-center font-[Futura] text-gray-400 mb-6">SMART CHARGING</Text>

                {/!* Welcome Text *!/}
                <Text className="text-left font-[Futura] text-1xl text-green mb-6">
                    Welcome to Andersen EV Charge Scheduler
                </Text>

                {/!* Email Input *!/}
                <Text className="font-semibold mb-1">Email</Text>
                <TextInput
                    placeholder="Enter your email"
                    className="border border-gray-300 rounded-md px-5 py-5 mb-4"
                />

                {/!* Password Input *!/}
                <Text className="font-semibold mb-1">Password</Text>
                <TextInput
                    placeholder="Enter your password"
                    secureTextEntry
                    className="border border-gray-300 rounded-md px-5 py-5 mb-2"
                />

                {/!* Forgot Password *!/}
                <Text className="text-sm text-gray-400 mb-4">Forgot Password?</Text>

                {/!* Sign In Button *!/}
                <TouchableOpacity className="bg-gray-900 px-5 py-5 rounded-md">
                    <Text className="text-white text-center font-semibold">
                        Sign in
                    </Text>
                </TouchableOpacity>
                {/!* Divider with text *!/}
                <View className="flex-row items-center my-4">
                    <View className="flex-1 h-px bg-gray-300" />
                    <Text className="mx-2 text-gray-500 text-sm">Not a member?</Text>
                    <View className="flex-1 h-px bg-gray-300" />
                </View>

                {/!* Register Button *!/}
                <Link href="../authentication/register" asChild>
                    <TouchableOpacity className="bg-green py-3 rounded-md">
                        <Text className="text-white text-center font-semibold">
                            Register
                        </Text>
                    </TouchableOpacity>
                </Link>

            </View>
        </View>
   */ );
}

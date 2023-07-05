import { Slot } from "expo-router";
import { TailwindProvider } from "tailwind-rn";
import utilities from "../tailwind.json";
import { SafeAreaView } from "react-native";

export default function DefaultLayout() {
    return <>
        <TailwindProvider utilities={utilities}>
            <SafeAreaView>
                <Slot />
            </SafeAreaView>
        </TailwindProvider>
    </>
}
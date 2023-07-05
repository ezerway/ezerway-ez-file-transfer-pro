import { Pressable, Text } from "react-native";

export function Button({ label, onPress }: { label: string, onPress?: any }) {
    return <Pressable onPress={onPress}>
        <Text>{label}</Text>
    </Pressable>
}
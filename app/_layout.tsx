import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom'
      }}
    >
      <Stack.Screen
        name="index"
      />
      <Stack.Screen
        name="analysis"
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Analysis',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/");
              }}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          )
        }}
      />
    </Stack>
  );
}

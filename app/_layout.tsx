import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Platform, TouchableOpacity, StyleSheet, StatusBar, View, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.statusBarPlaceholder} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_bottom',
          contentStyle: { backgroundColor },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            contentStyle: {
              backgroundColor,
            }
          }}
        />
        <Stack.Screen
          name="analysis"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTransparent: true,
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            headerTitle: () => (
              <BlurView intensity={80} style={styles.headerTitleContainer}>
                <ThemedText style={styles.headerTitle}>Analysis</ThemedText>
              </BlurView>
            ),
            headerBackground: () => (
              <BlurView intensity={80} style={[
                StyleSheet.absoluteFill,
                styles.headerBackground
              ]} />
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.push("/")}
                style={styles.headerButton}
                activeOpacity={0.7}
              >
                <BlurView intensity={80} style={styles.headerButtonContent}>
                  <Ionicons
                    name="close"
                    size={22}
                    color={textColor}
                  />
                </BlurView>
              </TouchableOpacity>
            ),
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

const styles = StyleSheet.create({
  statusBarPlaceholder: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 47,
    backgroundColor: 'transparent',
  },
  headerBackground: {
    height: Platform.OS === 'ios' ? 110 : 70,
  },
  headerTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  headerButton: {
    marginLeft: 8,
  },
  headerButtonContent: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    overflow: 'hidden',
  },
});

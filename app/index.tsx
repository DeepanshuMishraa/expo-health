import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Platform, StatusBar } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { useAnalysisStore } from '@/stores/useAnalysisStore'
import { BlurView } from 'expo-blur'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  withSpring,
  useAnimatedStyle,
  withSequence,
  withDelay,
  useSharedValue
} from 'react-native-reanimated'

const Index = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const setAnalysis = useAnalysisStore((state) => state.setAnalysis)
  const setImageUri = useAnalysisStore((state) => state.setImageUri)
  const scale = useSharedValue(1)

  // Animate the buttons on mount
  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.02),
      withDelay(100, withSpring(1))
    )
  }, [])

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const captureImage = async (camera = false) => {
    let result;

    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        base64: true,
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
      };

      if (camera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera permissions to make this work!');
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets[0].base64) {
        setIsLoading(true);
        try {
          setImageUri(result.assets[0].uri);
          const response = await fetch("/api/analyse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: {
                inlineData: {
                  data: result.assets[0].base64,
                  mimeType: "image/jpeg",
                }
              }
            })
          });

          const data = await response.json();

          if (data.status === 200) {
            const cleanText = data.response
              .replace(/[\u201C\u201D]/g, '"')
              .replace(/\\n/g, '')
              .trim();

            try {
              const analysisData = JSON.parse(cleanText);
              setAnalysis(analysisData.foodAnalysis);
              router.push("/analysis");
            } catch (parseError) {
              const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                try {
                  const extractedJson = JSON.parse(jsonMatch[0]);
                  setAnalysis(extractedJson.foodAnalysis);
                  router.push("/analysis");
                } catch (secondaryError) {
                  console.error("Error parsing extracted JSON:", secondaryError);
                  alert("Error processing analysis results. Please try again.");
                }
              } else {
                console.error("Error parsing analysis:", parseError);
                alert("Error processing analysis results. Please try again.");
              }
            }
          } else {
            console.error("Analysis failed:", data.message);
            alert("Failed to analyze image. Please try again with a clearer photo.");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Error uploading image. Please check your connection and try again.");
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      alert("Error capturing image. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <ThemedView style={[
      styles.container,
      { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 20 : 60 }
    ]}>
      <Animated.View
        entering={FadeIn.duration(800).delay(200)}
        style={styles.header}
      >
        <ThemedText style={styles.title}>Calorify</ThemedText>
        <ThemedText style={styles.subtitle}>
          Analyze your food with AI
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={SlideInDown.duration(800).delay(400)}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          onPress={() => captureImage(true)}
          disabled={isLoading}
        >
          <Animated.View style={[buttonStyle]}>
            <BlurView intensity={80} style={styles.button}>
              <Ionicons name="camera" size={28} color="white" />
              <ThemedText style={styles.buttonText}>Take Photo</ThemedText>
            </BlurView>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => captureImage(false)}
          disabled={isLoading}
        >
          <Animated.View style={[buttonStyle]}>
            <BlurView intensity={80} style={styles.button}>
              <Ionicons name="images" size={28} color="white" />
              <ThemedText style={styles.buttonText}>Choose from Gallery</ThemedText>
            </BlurView>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(800).delay(600)}
        style={styles.footer}
      >
        <TouchableOpacity
          onPress={() => router.push("/analysis")}
          disabled={isLoading}
        >
          <BlurView intensity={60} style={styles.analysisButton}>
            <ThemedText style={styles.analysisButtonText}>View Previous Analysis</ThemedText>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      {isLoading && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.loadingOverlay}
        >
          <BlurView intensity={95} style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>Analyzing your food...</ThemedText>
          </BlurView>
        </Animated.View>
      )}
    </ThemedView>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 48, // Explicit line height to prevent text cutoff
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    letterSpacing: -0.3,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    gap: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  analysisButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
  },
  analysisButtonText: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingContent: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
})

export default Index

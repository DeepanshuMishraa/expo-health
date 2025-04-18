import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { useAnalysisStore } from '@/stores/useAnalysisStore'

const index = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const setAnalysis = useAnalysisStore((state) => state.setAnalysis);

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
            // Clean up the response text and attempt to parse it
            const cleanText = data.response
              .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
              .replace(/\\n/g, '') // Remove newlines
              .trim(); // Remove extra whitespace

            try {
              // First try parsing the text directly
              const analysisData = JSON.parse(cleanText);
              setAnalysis(analysisData.foodAnalysis);
              router.push("/analysis");
            } catch (parseError) {
              // If direct parsing fails, try to extract JSON from the text
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
    <View style={styles.container}>
      <Text style={styles.title}>Health Tracker</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => captureImage(true)}
          disabled={isLoading}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => captureImage(false)}
          disabled={isLoading}
        >
          <Ionicons name="images" size={24} color="white" />
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.analysisButton}
        onPress={() => router.push("/analysis")}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>View Analysis</Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Analyzing image...</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  analysisButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  }
})

export default index

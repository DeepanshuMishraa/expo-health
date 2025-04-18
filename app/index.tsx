import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'

const index = () => {
  const router = useRouter()

  const captureImage = async (camera = false) => {
    let result;

    if (camera) {
      await ImagePicker.requestCameraPermissionsAsync();

      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
        base64: true,
      });

      return result;

    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        base64: true,
      });
    }

    if (!result.canceled) {

      try {
        const response = await axios.post("/api/analyse", {
          image: {
            inlineData: {
              data: result.assets[0].base64,
            }
          }
        })
        const data = await response.data;
        console.log(data);
      }
      catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Tracker</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => captureImage(true)}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => captureImage(false)}
        >
          <Ionicons name="images" size={24} color="white" />
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.analysisButton}
        onPress={() => router.push("/analysis")}
      >
        <Text style={styles.buttonText}>View Analysis</Text>
      </TouchableOpacity>
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
})

export default index

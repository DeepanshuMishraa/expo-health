import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Collapsible } from '@/components/Collapsible'

const Analysis = () => {
  // We'll implement state management for the analysis data later
  const dummyData = {
    foodAnalysis: {
      identifiedFood: "Loading...",
      portionSize: "0",
      recognizedServingSize: "0",
      nutritionFactsPerPortion: {
        calories: "0",
        protein: "0",
        carbs: "0",
        fat: "0",
        fiber: "0",
        sugar: "0",
        sodium: "0",
        cholesterol: "0"
      },
      nutritionFactsPer100g: {
        calories: "0",
        protein: "0",
        carbs: "0",
        fat: "0",
        fiber: "0",
        sugar: "0",
        sodium: "0",
        cholesterol: "0"
      },
      additionalNotes: []
    }
  }

  const renderNutritionFacts = (facts: any, title: string) => (
    <View style={styles.nutritionSection}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <View style={styles.nutritionGrid}>
        <View style={styles.nutritionItem}>
          <ThemedText>Calories</ThemedText>
          <ThemedText>{facts.calories}</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText>Protein</ThemedText>
          <ThemedText>{facts.protein}g</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText>Carbs</ThemedText>
          <ThemedText>{facts.carbs}g</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText>Fat</ThemedText>
          <ThemedText>{facts.fat}g</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText>Fiber</ThemedText>
          <ThemedText>{facts.fiber}g</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText>Sugar</ThemedText>
          <ThemedText>{facts.sugar}g</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText>Sodium</ThemedText>
          <ThemedText>{facts.sodium}mg</ThemedText>
        </View>
        <View style={styles.nutritionItem}>
          <ThemedText>Cholesterol</ThemedText>
          <ThemedText>{facts.cholesterol}mg</ThemedText>
        </View>
      </View>
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.foodTitle}>
          {dummyData.foodAnalysis.identifiedFood}
        </ThemedText>

        <View style={styles.servingInfo}>
          <ThemedText>
            Portion Size: {dummyData.foodAnalysis.portionSize}g
          </ThemedText>
          <ThemedText>
            Serving Size: {dummyData.foodAnalysis.recognizedServingSize}g
          </ThemedText>
        </View>

        <Collapsible title="Nutrition Facts (Per Portion)">
          {renderNutritionFacts(
            dummyData.foodAnalysis.nutritionFactsPerPortion,
            "Per Portion"
          )}
        </Collapsible>

        <Collapsible title="Nutrition Facts (Per 100g)">
          {renderNutritionFacts(
            dummyData.foodAnalysis.nutritionFactsPer100g,
            "Per 100g"
          )}
        </Collapsible>

        {dummyData.foodAnalysis.additionalNotes.length > 0 && (
          <View style={styles.notes}>
            <ThemedText type="subtitle">Additional Notes</ThemedText>
            {dummyData.foodAnalysis.additionalNotes.map((note, index) => (
              <ThemedText key={index} style={styles.note}>
                • {note}
              </ThemedText>
            ))}
          </View>
        )}
      </ThemedView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  foodTitle: {
    marginBottom: 20,
  },
  servingInfo: {
    marginBottom: 20,
    gap: 5,
  },
  nutritionSection: {
    marginVertical: 10,
  },
  nutritionGrid: {
    marginTop: 10,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notes: {
    marginTop: 20,
  },
  note: {
    marginTop: 10,
  },
})

export default Analysis

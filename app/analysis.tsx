import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Collapsible } from '@/components/Collapsible'
import { useAnalysisStore } from '@/stores/useAnalysisStore'
import { useRouter } from 'expo-router'

const Analysis = () => {
  const analysis = useAnalysisStore((state) => state.analysis)
  const router = useRouter()

  // Redirect to home if no analysis data
  React.useEffect(() => {
    if (!analysis) {
      router.push('/')
    }
  }, [analysis])

  if (!analysis) {
    return null;
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
          {analysis.identifiedFood}
        </ThemedText>

        <View style={styles.servingInfo}>
          <ThemedText>
            Portion Size: {analysis.portionSize}g
          </ThemedText>
          <ThemedText>
            Serving Size: {analysis.recognizedServingSize}g
          </ThemedText>
        </View>

        <Collapsible title="Nutrition Facts (Per Portion)">
          {renderNutritionFacts(
            analysis.nutritionFactsPerPortion,
            "Per Portion"
          )}
        </Collapsible>

        <Collapsible title="Nutrition Facts (Per 100g)">
          {renderNutritionFacts(
            analysis.nutritionFactsPer100g,
            "Per 100g"
          )}
        </Collapsible>

        {analysis.additionalNotes.length > 0 && (
          <View style={styles.notes}>
            <ThemedText type="subtitle">Additional Notes</ThemedText>
            {analysis.additionalNotes.map((note, index) => (
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

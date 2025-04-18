import { View, StyleSheet, ScrollView, Dimensions, Platform, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useAnalysisStore } from '@/stores/useAnalysisStore'
import { useRouter } from 'expo-router'
import { BlurView } from 'expo-blur'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')
const HEADER_MAX_HEIGHT = height * 0.4
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 110 : 70
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

const Analysis = () => {
  const analysis = useAnalysisStore((state) => state.analysis)
  const imageUri = useAnalysisStore((state) => state.imageUri)
  const router = useRouter()
  const scrollY = useSharedValue(0)

  useEffect(() => {
    if (!analysis) {
      router.push('/')
    }
  }, [analysis])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  const imageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0, HEADER_SCROLL_DISTANCE],
      [2.5, 1, 1],
      'clamp'
    )
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, -HEADER_SCROLL_DISTANCE / 2],
      'clamp'
    )
    return {
      transform: [{ scale }, { translateY }],
    }
  })

  const headerOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, 1],
      'clamp'
    )
    return { opacity }
  })

  if (!analysis) return null

  const renderNutritionItem = (label: string, value: string | number, unit: string = '', color = '#007AFF') => (
    <Animated.View
      entering={FadeInDown.springify().damping(12)}
      style={[styles.nutritionItem]}
    >
      <BlurView intensity={80} style={styles.nutritionItemContent}>
        <View style={[styles.nutritionColorBar, { backgroundColor: color }]} />
        <View style={styles.nutritionMain}>
          <ThemedText style={styles.nutritionLabel}>{label}</ThemedText>
          <View style={styles.nutritionValueContainer}>
            <ThemedText style={[styles.nutritionValue, { color }]}>{value}</ThemedText>
            <ThemedText style={styles.nutritionUnit}>{unit}</ThemedText>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  )

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { height: HEADER_MAX_HEIGHT }]}>
          <Animated.View style={[styles.imageContainer, imageStyle]}>
            <Image
              source={{ uri: imageUri || undefined }}
              style={styles.image}
              resizeMode="cover"
            />
            <Animated.View style={[styles.headerOverlay, headerOverlayStyle]}>
              <BlurView intensity={80} style={StyleSheet.absoluteFill} />
            </Animated.View>
          </Animated.View>
        </View>

        <View style={styles.content}>
          <BlurView intensity={80} style={styles.mainCard}>
            <Animated.View
              entering={FadeIn.duration(600)}
              style={styles.foodTitleContainer}
            >
              <ThemedText style={styles.foodTitle}>
                {analysis.identifiedFood}
              </ThemedText>
            </Animated.View>

            <View style={styles.metricsRow}>
              <Animated.View
                entering={FadeInDown.duration(400).delay(200)}
                style={styles.metricCard}
              >
                <BlurView intensity={60} style={styles.metricContent}>
                  <Ionicons name="scale" size={20} color="#007AFF" />
                  <View>
                    <ThemedText style={styles.metricValue}>{analysis.portionSize}g</ThemedText>
                    <ThemedText style={styles.metricLabel}>Portion</ThemedText>
                  </View>
                </BlurView>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.duration(400).delay(300)}
                style={styles.metricCard}
              >
                <BlurView intensity={60} style={styles.metricContent}>
                  <Ionicons name="restaurant" size={20} color="#34C759" />
                  <View>
                    <ThemedText style={styles.metricValue}>{analysis.recognizedServingSize}g</ThemedText>
                    <ThemedText style={styles.metricLabel}>Serving</ThemedText>
                  </View>
                </BlurView>
              </Animated.View>
            </View>

            <View style={styles.nutritionSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="nutrition" size={22} color="#007AFF" />
                <ThemedText style={styles.sectionTitle}>Nutrition Facts</ThemedText>
              </View>

              <View style={styles.nutritionGrid}>
                {renderNutritionItem('Calories', analysis.nutritionFactsPerPortion.calories, '', '#FF9500')}
                {renderNutritionItem('Protein', analysis.nutritionFactsPerPortion.protein, 'g', '#34C759')}
                {renderNutritionItem('Carbs', analysis.nutritionFactsPerPortion.carbs, 'g', '#007AFF')}
                {renderNutritionItem('Fat', analysis.nutritionFactsPerPortion.fat, 'g', '#FF3B30')}
                {renderNutritionItem('Fiber', analysis.nutritionFactsPerPortion.fiber, 'g', '#5856D6')}
                {renderNutritionItem('Sugar', analysis.nutritionFactsPerPortion.sugar, 'g', '#FF2D55')}
                {renderNutritionItem('Sodium', analysis.nutritionFactsPerPortion.sodium, 'mg', '#FF9500')}
                {renderNutritionItem('Cholesterol', analysis.nutritionFactsPerPortion.cholesterol, 'mg', '#AF52DE')}
              </View>
            </View>

            {analysis.additionalNotes.length > 0 && (
              <View style={styles.notesSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="information-circle" size={22} color="#5856D6" />
                  <ThemedText style={styles.sectionTitle}>Additional Notes</ThemedText>
                </View>
                {analysis.additionalNotes.map((note, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInDown.duration(400).delay(200 + index * 100)}
                    style={styles.noteItem}
                  >
                    <BlurView intensity={60} style={styles.noteContent}>
                      <Ionicons name="checkmark-circle" size={18} color="#34C759" />
                      <ThemedText style={styles.noteText}>{note}</ThemedText>
                    </BlurView>
                  </Animated.View>
                ))}
              </View>
            )}
          </BlurView>
        </View>
      </Animated.ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    minHeight: height + HEADER_MAX_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    marginTop: HEADER_MAX_HEIGHT - 40,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  mainCard: {
    borderRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  foodTitleContainer: {
    marginBottom: 24,
  },
  foodTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  nutritionSection: {
    marginBottom: 24,
  },
  nutritionGrid: {
    gap: 12,
  },
  nutritionItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nutritionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  nutritionColorBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  nutritionMain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  nutritionLabel: {
    fontSize: 16,
    opacity: 0.9,
  },
  nutritionValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  nutritionUnit: {
    fontSize: 14,
    opacity: 0.6,
  },
  notesSection: {
    gap: 12,
  },
  noteItem: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  noteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  noteText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.8,
  },
})

export default Analysis

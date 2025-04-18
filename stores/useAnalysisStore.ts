import { create } from 'zustand'

export interface NutritionFacts {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar: string;
  sodium: string;
  cholesterol: string;
}

export interface FoodAnalysis {
  identifiedFood: string;
  portionSize: string;
  recognizedServingSize: string;
  nutritionFactsPerPortion: NutritionFacts;
  nutritionFactsPer100g: NutritionFacts;
  additionalNotes: string[];
}

interface AnalysisStore {
  analysis: FoodAnalysis | null;
  setAnalysis: (analysis: FoodAnalysis) => void;
  clearAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  analysis: null,
  setAnalysis: (analysis) => set({ analysis }),
  clearAnalysis: () => set({ analysis: null }),
}))

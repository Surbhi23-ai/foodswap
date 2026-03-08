export type HealthLabel = "Safe" | "Moderate" | "Avoid";

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface FoodAlternative {
  name: string;
  reason: string;
  healthLabel: HealthLabel;
  nutrition: NutritionInfo;
}

export interface FoodResult {
  name: string;
  healthLabel: HealthLabel;
  explanation: string;
  nutrition: NutritionInfo;
  alternatives: FoodAlternative[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

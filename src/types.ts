export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Cuisine = 'mexican' | 'italian' | 'indian' | 'mediterranean' | 'asian' | 'american' | 'moroccan' | 'greek';
export type WorkoutPhase = 1 | 2 | 3 | 4;
export type DayType = 'upper' | 'lower' | 'cardio' | 'full_body' | 'yoga' | 'rest';

export interface Meal {
  id: string;
  name: string;
  cuisine: Cuisine;
  type: MealType;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  servingSize: string;
  prepTime: number;
  weekdayFriendly: boolean;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export interface Exercise {
  id: string;
  name: string;
  category: 'upper' | 'lower' | 'core' | 'cardio' | 'flexibility';
  sets?: number;
  reps?: string;
  duration?: string;
  equipment: string[];
  instructions: string;
  aclModification: string;
  targetMuscles: string[];
  difficulty: 1 | 2 | 3;
}

export interface WorkoutDay {
  id: string;
  name: string;
  type: DayType;
  phase: WorkoutPhase;
  dayOfWeek: number;
  duration: string;
  description: string;
  exerciseIds: string[];
  cardioNotes?: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  notes?: string;
}

export interface MeasurementEntry {
  id: string;
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  rightArm?: number;
  leftArm?: number;
  rightThigh?: number;
  leftThigh?: number;
  notes?: string;
}

export interface WorkoutLogEntry {
  id: string;
  date: string;
  workoutName: string;
  phase: WorkoutPhase;
  duration: number;
  completedExercises: string[];
  mood?: 'great' | 'good' | 'okay' | 'hard';
  caloriesBurned?: number;
  notes?: string;
}

export interface NutritionLogMeal {
  mealId: string;
  mealName: string;
  portionMultiplier: number;
  calories: number;
  protein: number;
}

export interface NutritionLogEntry {
  id: string;
  date: string;
  meals: NutritionLogMeal[];
  waterIntake: number;
  totalCalories: number;
  totalProtein: number;
  notes?: string;
}

export interface MealFeedback {
  mealId: string;
  rating: number;
  reaction: 'liked' | 'disliked' | null;
  notes?: string;
}

export interface AppState {
  weightLogs: WeightEntry[];
  measurementLogs: MeasurementEntry[];
  workoutLogs: WorkoutLogEntry[];
  nutritionLogs: NutritionLogEntry[];
  mealFeedback: Record<string, MealFeedback>;
  startDate: string;
  currentPhase: WorkoutPhase;
}

import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  AppState, WeightEntry, MeasurementEntry, WorkoutLogEntry,
  NutritionLogEntry, MealFeedback, WorkoutPhase,
} from '../types';
import { generateId, calculateCurrentPhase, USER_PROFILE } from '../utils/calculations';

const defaultState: AppState = {
  weightLogs: [],
  measurementLogs: [],
  workoutLogs: [],
  nutritionLogs: [],
  mealFeedback: {},
  startDate: USER_PROFILE.startDate,
  currentPhase: 1,
};

type Action =
  | { type: 'ADD_WEIGHT'; payload: Omit<WeightEntry, 'id'> }
  | { type: 'DELETE_WEIGHT'; payload: string }
  | { type: 'ADD_MEASUREMENT'; payload: Omit<MeasurementEntry, 'id'> }
  | { type: 'ADD_WORKOUT_LOG'; payload: Omit<WorkoutLogEntry, 'id'> }
  | { type: 'ADD_NUTRITION_LOG'; payload: Omit<NutritionLogEntry, 'id'> }
  | { type: 'UPDATE_NUTRITION_LOG'; payload: NutritionLogEntry }
  | { type: 'SET_MEAL_FEEDBACK'; payload: MealFeedback }
  | { type: 'SET_PHASE'; payload: WorkoutPhase }
  | { type: 'SET_START_DATE'; payload: string }
  | { type: 'LOAD'; payload: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD_WEIGHT':
      return { ...state, weightLogs: [...state.weightLogs, { id: generateId(), ...action.payload }] };
    case 'DELETE_WEIGHT':
      return { ...state, weightLogs: state.weightLogs.filter(w => w.id !== action.payload) };
    case 'ADD_MEASUREMENT':
      return { ...state, measurementLogs: [...state.measurementLogs, { id: generateId(), ...action.payload }] };
    case 'ADD_WORKOUT_LOG':
      return { ...state, workoutLogs: [...state.workoutLogs, { id: generateId(), ...action.payload }] };
    case 'ADD_NUTRITION_LOG': {
      const idx = state.nutritionLogs.findIndex(n => n.date === action.payload.date);
      if (idx >= 0) {
        const updated = [...state.nutritionLogs];
        updated[idx] = { id: updated[idx].id, ...action.payload };
        return { ...state, nutritionLogs: updated };
      }
      return { ...state, nutritionLogs: [...state.nutritionLogs, { id: generateId(), ...action.payload }] };
    }
    case 'UPDATE_NUTRITION_LOG':
      return { ...state, nutritionLogs: state.nutritionLogs.map(n => n.id === action.payload.id ? action.payload : n) };
    case 'SET_MEAL_FEEDBACK':
      return { ...state, mealFeedback: { ...state.mealFeedback, [action.payload.mealId]: action.payload } };
    case 'SET_PHASE':
      return { ...state, currentPhase: action.payload };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload, currentPhase: calculateCurrentPhase(action.payload) };
    default:
      return state;
  }
}

// ── DB helpers ────────────────────────────────────────────────────────────────

async function loadUserData(userId: string): Promise<AppState> {
  const [weights, measurements, workouts, nutrition, feedback, settings] = await Promise.all([
    supabase.from('weight_logs').select('*').eq('user_id', userId),
    supabase.from('measurement_logs').select('*').eq('user_id', userId),
    supabase.from('workout_logs').select('*').eq('user_id', userId),
    supabase.from('nutrition_logs').select('*').eq('user_id', userId),
    supabase.from('meal_feedback').select('*').eq('user_id', userId),
    supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
  ]);

  const weightLogs: WeightEntry[] = (weights.data ?? []).map(r => ({
    id: r.id, date: r.date, weight: r.weight, notes: r.notes ?? undefined,
  }));

  const measurementLogs: MeasurementEntry[] = (measurements.data ?? []).map(r => ({
    id: r.id, date: r.date, notes: r.notes ?? undefined,
    chest: r.chest ?? undefined, waist: r.waist ?? undefined, hips: r.hips ?? undefined,
    rightArm: r.right_arm ?? undefined, leftArm: r.left_arm ?? undefined,
    rightThigh: r.right_thigh ?? undefined, leftThigh: r.left_thigh ?? undefined,
  }));

  const workoutLogs: WorkoutLogEntry[] = (workouts.data ?? []).map(r => ({
    id: r.id, date: r.date, workoutName: r.workout_name,
    phase: r.phase as WorkoutPhase, duration: r.duration,
    completedExercises: r.completed_exercises ?? [],
    mood: r.mood ?? undefined, notes: r.notes ?? undefined,
  }));

  const nutritionLogs: NutritionLogEntry[] = (nutrition.data ?? []).map(r => ({
    id: r.id, date: r.date, meals: r.meals ?? [],
    waterIntake: r.water_intake, totalCalories: r.total_calories,
    totalProtein: r.total_protein, notes: r.notes ?? undefined,
  }));

  const mealFeedback: Record<string, MealFeedback> = {};
  (feedback.data ?? []).forEach(r => {
    mealFeedback[r.meal_id] = { mealId: r.meal_id, reaction: r.reaction ?? null, rating: r.rating ?? 0 };
  });

  const s = settings.data;
  const startDate = s?.start_date ?? USER_PROFILE.startDate;
  const currentPhase = (s?.current_phase ?? calculateCurrentPhase(startDate)) as WorkoutPhase;

  return { weightLogs, measurementLogs, workoutLogs, nutritionLogs, mealFeedback, startDate, currentPhase };
}

// ── Context ───────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: (action: Action) => void;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, localDispatch] = useReducer(reducer, defaultState);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hold a ref to state so async closures in dispatch can read current state
  const stateRef = React.useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const loadAndSet = useCallback(async (u: User) => {
    setLoading(true);
    const data = await loadUserData(u.id);
    localDispatch({ type: 'LOAD', payload: data });
    setLoading(false);
  }, []);

  // Subscribe to auth state once on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        loadAndSet(u).catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        loadAndSet(u).catch(() => setLoading(false));
      } else {
        localDispatch({ type: 'LOAD', payload: defaultState });
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadAndSet]);

  // Wrapped dispatch: optimistic local update + async Supabase sync
  const dispatch = useCallback(async (action: Action) => {
    localDispatch(action);

    const uid = user?.id;
    if (!uid) return;

    try {
      switch (action.type) {
        case 'ADD_WEIGHT': {
          const id = generateId();
          await supabase.from('weight_logs').insert({
            id, user_id: uid, date: action.payload.date,
            weight: action.payload.weight, notes: action.payload.notes ?? null,
          });
          break;
        }
        case 'DELETE_WEIGHT':
          await supabase.from('weight_logs').delete().eq('id', action.payload);
          break;

        case 'ADD_MEASUREMENT': {
          const id = generateId();
          const p = action.payload;
          await supabase.from('measurement_logs').insert({
            id, user_id: uid, date: p.date, notes: p.notes ?? null,
            chest: p.chest ?? null, waist: p.waist ?? null, hips: p.hips ?? null,
            right_arm: p.rightArm ?? null, left_arm: p.leftArm ?? null,
            right_thigh: p.rightThigh ?? null, left_thigh: p.leftThigh ?? null,
          });
          break;
        }

        case 'ADD_WORKOUT_LOG': {
          const id = generateId();
          const p = action.payload;
          await supabase.from('workout_logs').insert({
            id, user_id: uid, date: p.date, workout_name: p.workoutName,
            phase: p.phase, duration: p.duration,
            completed_exercises: p.completedExercises,
            mood: p.mood ?? null, notes: p.notes ?? null,
          });
          break;
        }

        case 'ADD_NUTRITION_LOG': {
          // Use existing row's id if the date already exists (so we UPDATE not INSERT)
          const existing = stateRef.current.nutritionLogs.find(n => n.date === action.payload.date);
          const id = existing?.id ?? generateId();
          const p = action.payload;
          await supabase.from('nutrition_logs').upsert({
            id, user_id: uid, date: p.date,
            meals: p.meals, water_intake: p.waterIntake,
            total_calories: p.totalCalories, total_protein: p.totalProtein,
            notes: p.notes ?? null,
          }, { onConflict: 'id' });
          break;
        }

        case 'SET_MEAL_FEEDBACK': {
          const p = action.payload;
          await supabase.from('meal_feedback').upsert({
            meal_id: p.mealId, user_id: uid,
            reaction: p.reaction ?? null, rating: p.rating,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'meal_id,user_id' });
          break;
        }

        case 'SET_PHASE':
          await supabase.from('user_settings').upsert({
            user_id: uid, current_phase: action.payload,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
          break;

        case 'SET_START_DATE':
          await supabase.from('user_settings').upsert({
            user_id: uid, start_date: action.payload,
            current_phase: calculateCurrentPhase(action.payload),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
          break;
      }
    } catch (err) {
      console.error('[Supabase sync error]', action.type, err);
    }
  }, [user]);

  const signOut = useCallback(() => supabase.auth.signOut().then(() => {}), []);

  return (
    <AppContext.Provider value={{ state, dispatch, user, loading, signOut }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

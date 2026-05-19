import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  AppState, WeightEntry, MeasurementEntry, WorkoutLogEntry,
  NutritionLogEntry, MealFeedback, WorkoutPhase, Profile, HealthDataLog,
} from '../types';
import { generateId, calculateCurrentPhase, todayStr, USER_PROFILE } from '../utils/calculations';

const defaultState: AppState = {
  weightLogs: [],
  measurementLogs: [],
  workoutLogs: [],
  nutritionLogs: [],
  mealFeedback: {},
  startDate: USER_PROFILE.startDate,
  currentPhase: 1,
  profiles: [],
  activeProfileId: null,
  healthDataLogs: [],
  ouraToken: null,
};

type Action =
  | { type: 'ADD_WEIGHT'; payload: Omit<WeightEntry, 'id'> }
  | { type: 'DELETE_WEIGHT'; payload: string }
  | { type: 'ADD_MEASUREMENT'; payload: Omit<MeasurementEntry, 'id'> }
  | { type: 'DELETE_MEASUREMENT'; payload: string }
  | { type: 'ADD_WORKOUT_LOG'; payload: Omit<WorkoutLogEntry, 'id'> }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'ADD_NUTRITION_LOG'; payload: Omit<NutritionLogEntry, 'id'> }
  | { type: 'UPDATE_NUTRITION_LOG'; payload: NutritionLogEntry }
  | { type: 'DELETE_NUTRITION_LOG'; payload: string }
  | { type: 'DELETE_MEAL_FROM_LOG'; payload: { date: string; mealIndex: number } }
  | { type: 'SET_MEAL_FEEDBACK'; payload: MealFeedback }
  | { type: 'SET_PHASE'; payload: WorkoutPhase }
  | { type: 'SET_START_DATE'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: Profile }
  | { type: 'SET_ACTIVE_PROFILE'; payload: string }
  | { type: 'ADD_HEALTH_DATA'; payload: Omit<HealthDataLog, 'id'> }
  | { type: 'DELETE_HEALTH_DATA'; payload: string }
  | { type: 'SET_OURA_TOKEN'; payload: string | null }
  | { type: 'LOAD'; payload: AppState }
  | { type: 'LOAD_PROFILE_DATA'; payload: Partial<AppState> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD':
      return action.payload;

    case 'LOAD_PROFILE_DATA':
      return { ...state, ...action.payload };

    case 'ADD_WEIGHT':
      return { ...state, weightLogs: [...state.weightLogs, { id: generateId(), ...action.payload }] };

    case 'DELETE_WEIGHT':
      return { ...state, weightLogs: state.weightLogs.filter(w => w.id !== action.payload) };

    case 'ADD_MEASUREMENT':
      return { ...state, measurementLogs: [...state.measurementLogs, { id: generateId(), ...action.payload }] };

    case 'DELETE_MEASUREMENT':
      return { ...state, measurementLogs: state.measurementLogs.filter(m => m.id !== action.payload) };

    case 'ADD_WORKOUT_LOG':
      return { ...state, workoutLogs: [...state.workoutLogs, { id: generateId(), ...action.payload }] };

    case 'DELETE_WORKOUT':
      return { ...state, workoutLogs: state.workoutLogs.filter(w => w.id !== action.payload) };

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

    case 'DELETE_NUTRITION_LOG':
      return { ...state, nutritionLogs: state.nutritionLogs.filter(n => n.id !== action.payload) };

    case 'DELETE_MEAL_FROM_LOG': {
      const { date, mealIndex } = action.payload;
      return {
        ...state,
        nutritionLogs: state.nutritionLogs.map(log => {
          if (log.date !== date) return log;
          const meals = log.meals.filter((_, i) => i !== mealIndex);
          return {
            ...log,
            meals,
            totalCalories: meals.reduce((s, m) => s + m.calories, 0),
            totalProtein: meals.reduce((s, m) => s + m.protein, 0),
          };
        }),
      };
    }

    case 'SET_MEAL_FEEDBACK':
      return { ...state, mealFeedback: { ...state.mealFeedback, [action.payload.mealId]: action.payload } };

    case 'SET_PHASE':
      return { ...state, currentPhase: action.payload };

    case 'SET_START_DATE':
      return { ...state, startDate: action.payload, currentPhase: calculateCurrentPhase(action.payload) };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.map(p => p.profileId === action.payload.profileId ? action.payload : p),
        startDate: state.activeProfileId === action.payload.profileId ? action.payload.startDate : state.startDate,
        currentPhase: state.activeProfileId === action.payload.profileId ? action.payload.currentPhase : state.currentPhase,
      };

    case 'SET_ACTIVE_PROFILE': {
      const profile = state.profiles.find(p => p.profileId === action.payload);
      return {
        ...state,
        activeProfileId: action.payload,
        startDate: profile?.startDate ?? state.startDate,
        currentPhase: (profile?.currentPhase ?? state.currentPhase) as WorkoutPhase,
      };
    }

    case 'ADD_HEALTH_DATA': {
      const idx = state.healthDataLogs.findIndex(h => h.date === action.payload.date && h.profileId === action.payload.profileId);
      if (idx >= 0) {
        const updated = [...state.healthDataLogs];
        updated[idx] = { id: updated[idx].id, ...action.payload };
        return { ...state, healthDataLogs: updated };
      }
      return { ...state, healthDataLogs: [...state.healthDataLogs, { id: generateId(), ...action.payload }] };
    }

    case 'DELETE_HEALTH_DATA':
      return { ...state, healthDataLogs: state.healthDataLogs.filter(h => h.id !== action.payload) };

    case 'SET_OURA_TOKEN':
      return { ...state, ouraToken: action.payload };

    default:
      return state;
  }
}

// ── DB helpers ────────────────────────────────────────────────────────────────

async function loadProfiles(userId: string): Promise<Profile[]> {
  const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).order('created_at');
  return (data ?? []).map(r => ({
    profileId: r.profile_id,
    userId: r.user_id,
    name: r.name,
    avatarEmoji: r.avatar_emoji ?? '🏃',
    age: r.age ?? 30,
    heightInches: r.height_inches ?? 64,
    startWeight: r.start_weight ?? 191,
    goalWeight: r.goal_weight ?? 141,
    dietaryRestrictions: r.dietary_restrictions ?? [],
    startDate: r.start_date ?? USER_PROFILE.startDate,
    currentPhase: (r.current_phase ?? 1) as WorkoutPhase,
    isDefault: r.is_default ?? false,
    createdAt: r.created_at ?? new Date().toISOString(),
    fitnessGoal: (r.fitness_goal ?? 'weight_loss') as import('../types').FitnessGoal,
    activityLevel: (r.activity_level ?? 'moderately_active') as import('../types').ActivityLevel,
    healthConcerns: r.health_concerns ?? '',
  }));
}

async function loadProfileData(userId: string, profileId: string): Promise<Partial<AppState>> {
  const [weights, measurements, workouts, nutrition, feedback, healthData] = await Promise.all([
    supabase.from('weight_logs').select('*').eq('user_id', userId).eq('profile_id', profileId),
    supabase.from('measurement_logs').select('*').eq('user_id', userId).eq('profile_id', profileId),
    supabase.from('workout_logs').select('*').eq('user_id', userId).eq('profile_id', profileId),
    supabase.from('nutrition_logs').select('*').eq('user_id', userId).eq('profile_id', profileId),
    supabase.from('meal_feedback').select('*').eq('user_id', userId).eq('profile_id', profileId),
    supabase.from('health_data_logs').select('*').eq('user_id', userId).eq('profile_id', profileId),
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

  const healthDataLogs: HealthDataLog[] = (healthData.data ?? []).map(r => ({
    id: r.id, profileId: r.profile_id, date: r.date,
    sleepScore: r.sleep_score ?? undefined, readinessScore: r.readiness_score ?? undefined,
    activityScore: r.activity_score ?? undefined, hrvAvg: r.hrv_avg ?? undefined,
    sleepDurationHours: r.sleep_duration_hours ?? undefined,
    caloriesBurned: r.calories_burned ?? undefined, steps: r.steps ?? undefined,
    ouraSynced: r.oura_synced ?? false, notes: r.notes ?? undefined,
  }));

  return { weightLogs, measurementLogs, workoutLogs, nutritionLogs, mealFeedback, healthDataLogs };
}

async function loadUserData(userId: string): Promise<AppState> {
  const [profiles, ouraConn, settings] = await Promise.all([
    loadProfiles(userId),
    supabase.from('oura_connections').select('personal_access_token').eq('user_id', userId).maybeSingle(),
    supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
  ]);

  const ouraToken = ouraConn.data?.personal_access_token ?? null;

  const activeProfile = profiles.find(p => p.isDefault) ?? profiles[0];
  const activeProfileId = activeProfile?.profileId ?? null;

  // Derive startDate/currentPhase from the active profile (fallback to user_settings for old data)
  const s = settings.data;
  const startDate = activeProfile?.startDate ?? s?.start_date ?? USER_PROFILE.startDate;
  const currentPhase = (activeProfile?.currentPhase ?? s?.current_phase ?? calculateCurrentPhase(startDate)) as WorkoutPhase;

  let profileData: Partial<AppState> = {};
  if (activeProfileId) {
    profileData = await loadProfileData(userId, activeProfileId);
  } else {
    // Fallback: load by user_id only (pre-migration data without profile_id)
    const [weights, measurements, workouts, nutrition, feedback] = await Promise.all([
      supabase.from('weight_logs').select('*').eq('user_id', userId),
      supabase.from('measurement_logs').select('*').eq('user_id', userId),
      supabase.from('workout_logs').select('*').eq('user_id', userId),
      supabase.from('nutrition_logs').select('*').eq('user_id', userId),
      supabase.from('meal_feedback').select('*').eq('user_id', userId),
    ]);
    const mealFeedback: Record<string, MealFeedback> = {};
    (feedback.data ?? []).forEach(r => {
      mealFeedback[r.meal_id] = { mealId: r.meal_id, reaction: r.reaction ?? null, rating: r.rating ?? 0 };
    });
    profileData = {
      weightLogs: (weights.data ?? []).map(r => ({ id: r.id, date: r.date, weight: r.weight, notes: r.notes ?? undefined })),
      measurementLogs: (measurements.data ?? []).map(r => ({
        id: r.id, date: r.date, notes: r.notes ?? undefined,
        chest: r.chest ?? undefined, waist: r.waist ?? undefined, hips: r.hips ?? undefined,
        rightArm: r.right_arm ?? undefined, leftArm: r.left_arm ?? undefined,
        rightThigh: r.right_thigh ?? undefined, leftThigh: r.left_thigh ?? undefined,
      })),
      workoutLogs: (workouts.data ?? []).map(r => ({
        id: r.id, date: r.date, workoutName: r.workout_name, phase: r.phase as WorkoutPhase,
        duration: r.duration, completedExercises: r.completed_exercises ?? [],
        mood: r.mood ?? undefined, notes: r.notes ?? undefined,
      })),
      nutritionLogs: (nutrition.data ?? []).map(r => ({
        id: r.id, date: r.date, meals: r.meals ?? [],
        waterIntake: r.water_intake, totalCalories: r.total_calories,
        totalProtein: r.total_protein, notes: r.notes ?? undefined,
      })),
      mealFeedback,
      healthDataLogs: [],
    };
  }

  return {
    ...defaultState,
    ...profileData,
    profiles,
    activeProfileId,
    startDate,
    currentPhase,
    ouraToken,
  };
}

// ── Oura API sync ─────────────────────────────────────────────────────────────

async function fetchOuraData(token: string, date: string): Promise<Omit<HealthDataLog, 'id' | 'profileId'> | null> {
  const headers = { Authorization: `Bearer ${token}` };
  const start = date;
  const end = date;

  try {
    const [sleepRes, readinessRes, activityRes] = await Promise.all([
      fetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${start}&end_date=${end}`, { headers }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${start}&end_date=${end}`, { headers }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_activity?start_date=${start}&end_date=${end}`, { headers }),
    ]);

    const [sleepJson, readinessJson, activityJson] = await Promise.all([
      sleepRes.ok ? sleepRes.json() : null,
      readinessRes.ok ? readinessRes.json() : null,
      activityRes.ok ? activityRes.json() : null,
    ]);

    const sleep = sleepJson?.data?.[0];
    const readiness = readinessJson?.data?.[0];
    const activity = activityJson?.data?.[0];

    if (!sleep && !readiness && !activity) return null;

    return {
      date,
      sleepScore: sleep?.score ?? undefined,
      readinessScore: readiness?.score ?? undefined,
      activityScore: activity?.score ?? undefined,
      hrvAvg: readiness?.contributors?.hrv_balance ?? undefined,
      sleepDurationHours: sleep ? Math.round((sleep.contributors?.total_sleep ?? 0) / 36) / 100 : undefined,
      caloriesBurned: activity?.total_calories ?? undefined,
      steps: activity?.steps ?? undefined,
      ouraSynced: true,
    };
  } catch {
    return null;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: (action: Action) => void;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  activeProfile: Profile | null;
  switchProfile: (profileId: string) => Promise<void>;
  syncOura: (date?: string) => Promise<boolean>;
  saveOuraToken: (token: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, localDispatch] = useReducer(reducer, defaultState);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const stateRef = React.useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const loadAndSet = useCallback(async (u: User) => {
    setLoading(true);
    const data = await loadUserData(u.id);
    localDispatch({ type: 'LOAD', payload: data });
    setLoading(false);
  }, []);

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

  const switchProfile = useCallback(async (profileId: string) => {
    const uid = user?.id;
    if (!uid) return;
    setLoading(true);
    const profileData = await loadProfileData(uid, profileId);
    const profile = stateRef.current.profiles.find(p => p.profileId === profileId);
    localDispatch({
      type: 'LOAD_PROFILE_DATA',
      payload: {
        ...profileData,
        activeProfileId: profileId,
        startDate: profile?.startDate ?? stateRef.current.startDate,
        currentPhase: (profile?.currentPhase ?? stateRef.current.currentPhase) as WorkoutPhase,
      },
    });
    setLoading(false);
  }, [user]);

  const saveOuraToken = useCallback(async (token: string) => {
    const uid = user?.id;
    if (!uid) return;
    await supabase.from('oura_connections').upsert(
      { user_id: uid, personal_access_token: token },
      { onConflict: 'user_id' },
    );
    localDispatch({ type: 'SET_OURA_TOKEN', payload: token });
  }, [user]);

  const syncOura = useCallback(async (date?: string): Promise<boolean> => {
    const token = stateRef.current.ouraToken;
    const profileId = stateRef.current.activeProfileId;
    const uid = user?.id;
    if (!token || !profileId || !uid) return false;

    const targetDate = date ?? todayStr();
    const data = await fetchOuraData(token, targetDate);
    if (!data) return false;

    const payload = { ...data, profileId };
    localDispatch({ type: 'ADD_HEALTH_DATA', payload });

    const existing = stateRef.current.healthDataLogs.find(h => h.date === targetDate && h.profileId === profileId);
    const id = existing?.id ?? generateId();
    await supabase.from('health_data_logs').upsert({
      id, profile_id: profileId, user_id: uid, date: targetDate,
      sleep_score: data.sleepScore ?? null,
      readiness_score: data.readinessScore ?? null,
      activity_score: data.activityScore ?? null,
      hrv_avg: data.hrvAvg ?? null,
      sleep_duration_hours: data.sleepDurationHours ?? null,
      calories_burned: data.caloriesBurned ?? null,
      steps: data.steps ?? null,
      oura_synced: true,
    }, { onConflict: 'id' });

    await supabase.from('oura_connections').update({ last_synced_at: new Date().toISOString() }).eq('user_id', uid);
    return true;
  }, [user]);

  const dispatch = useCallback(async (action: Action) => {
    localDispatch(action);

    const uid = user?.id;
    if (!uid) return;

    const profileId = stateRef.current.activeProfileId;

    try {
      switch (action.type) {
        case 'ADD_WEIGHT': {
          const id = generateId();
          await supabase.from('weight_logs').insert({
            id, user_id: uid, profile_id: profileId,
            date: action.payload.date, weight: action.payload.weight, notes: action.payload.notes ?? null,
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
            id, user_id: uid, profile_id: profileId, date: p.date, notes: p.notes ?? null,
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
            id, user_id: uid, profile_id: profileId, date: p.date, workout_name: p.workoutName,
            phase: p.phase, duration: p.duration,
            completed_exercises: p.completedExercises, mood: p.mood ?? null, notes: p.notes ?? null,
          });
          break;
        }

        case 'ADD_NUTRITION_LOG': {
          const existing = stateRef.current.nutritionLogs.find(n => n.date === action.payload.date);
          const id = existing?.id ?? generateId();
          const p = action.payload;
          await supabase.from('nutrition_logs').upsert({
            id, user_id: uid, profile_id: profileId, date: p.date,
            meals: p.meals, water_intake: p.waterIntake,
            total_calories: p.totalCalories, total_protein: p.totalProtein, notes: p.notes ?? null,
          }, { onConflict: 'id' });
          break;
        }

        case 'DELETE_MEAL_FROM_LOG': {
          const { date, mealIndex } = action.payload;
          // Find the updated log from state after the optimistic local dispatch
          // We need to read the next state — use the reducer result directly
          const log = stateRef.current.nutritionLogs.find(n => n.date === date);
          if (!log) break;
          const meals = log.meals.filter((_, i) => i !== mealIndex);
          await supabase.from('nutrition_logs').update({
            meals,
            total_calories: meals.reduce((s, m) => s + m.calories, 0),
            total_protein: meals.reduce((s, m) => s + m.protein, 0),
          }).eq('id', log.id);
          break;
        }

        case 'SET_MEAL_FEEDBACK': {
          const p = action.payload;
          await supabase.from('meal_feedback').upsert({
            meal_id: p.mealId, user_id: uid, profile_id: profileId,
            reaction: p.reaction ?? null, rating: p.rating,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'meal_id,user_id' });
          break;
        }

        case 'SET_PHASE':
          await supabase.from('profiles').update({ current_phase: action.payload, updated_at: new Date().toISOString() } as any)
            .eq('profile_id', profileId);
          break;

        case 'SET_START_DATE':
          await supabase.from('profiles').update({
            start_date: action.payload,
            current_phase: calculateCurrentPhase(action.payload),
          } as any).eq('profile_id', profileId);
          break;

        case 'UPDATE_PROFILE': {
          const p = action.payload;
          await supabase.from('profiles').update({
            name: p.name, avatar_emoji: p.avatarEmoji, age: p.age ?? null,
            height_inches: p.heightInches ?? null, start_weight: p.startWeight ?? null,
            goal_weight: p.goalWeight ?? null,
            dietary_restrictions: p.dietaryRestrictions ?? [],
            start_date: p.startDate ?? null, current_phase: p.currentPhase ?? 1,
            fitness_goal: p.fitnessGoal ?? 'weight_loss',
            activity_level: p.activityLevel ?? 'moderately_active',
            health_concerns: p.healthConcerns ?? '',
          } as any).eq('profile_id', p.profileId);
          break;
        }

        case 'DELETE_MEASUREMENT':
          await supabase.from('measurement_logs').delete().eq('id', action.payload);
          break;

        case 'DELETE_WORKOUT':
          await supabase.from('workout_logs').delete().eq('id', action.payload);
          break;

        case 'DELETE_NUTRITION_LOG':
          await supabase.from('nutrition_logs').delete().eq('id', action.payload);
          break;

        case 'DELETE_HEALTH_DATA':
          await supabase.from('health_data_logs').delete().eq('id', action.payload);
          break;
      }
    } catch (err) {
      console.error('[Supabase sync error]', action.type, err);
    }
  }, [user]);

  const activeProfile = state.profiles.find(p => p.profileId === state.activeProfileId) ?? null;

  const signOut = useCallback(() => supabase.auth.signOut().then(() => {}), []);

  return (
    <AppContext.Provider value={{ state, dispatch, user, loading, signOut, activeProfile, switchProfile, syncOura, saveOuraToken }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

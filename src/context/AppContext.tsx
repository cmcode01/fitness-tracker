import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, WeightEntry, MeasurementEntry, WorkoutLogEntry, NutritionLogEntry, MealFeedback, WorkoutPhase } from '../types';
import { generateId, calculateCurrentPhase, USER_PROFILE } from '../utils/calculations';

const STORAGE_KEY = 'fitlife_state_v1';

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
      const existing = state.nutritionLogs.findIndex(n => n.date === action.payload.date);
      if (existing >= 0) {
        const updated = [...state.nutritionLogs];
        updated[existing] = { id: updated[existing].id, ...action.payload };
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

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppState;
        dispatch({ type: 'LOAD', payload: { ...defaultState, ...parsed } });
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

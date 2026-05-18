import React from 'react';
import { useApp } from '../context/AppContext';
import { getWeeklyMealPlan } from '../data/meals';
import { getTodayWorkout, phaseInfo } from '../data/workouts';
import {
  calculateBMR, calculateTDEE, calculateTargetCalories,
  calculateProteinTarget, calculateCurrentWeek, USER_PROFILE, DAY_NAMES
} from '../utils/calculations';

interface Props { setActiveTab: (tab: string) => void }

const Dashboard: React.FC<Props> = ({ setActiveTab }) => {
  const { state } = useApp();
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekNumber = calculateCurrentWeek(state.startDate) - 1;
  const phase = state.currentPhase;

  const todayWorkout = getTodayWorkout(phase, dayOfWeek);
  const weekMeals = getWeeklyMealPlan(weekNumber);
  const todayMeals = weekMeals[dayOfWeek];

  const latestWeight = state.weightLogs.sort((a, b) => b.date.localeCompare(a.date))[0]?.weight ?? USER_PROFILE.startWeight;
  const lostSoFar = USER_PROFILE.startWeight - latestWeight;
  const remaining = latestWeight - USER_PROFILE.targetWeight;
  const progressPct = Math.min(100, Math.max(0, (lostSoFar / (USER_PROFILE.startWeight - USER_PROFILE.targetWeight)) * 100));

  const bmr = calculateBMR(latestWeight, USER_PROFILE.heightInches, USER_PROFILE.age);
  const targetCals = calculateTargetCalories(calculateTDEE(bmr));
  const targetProtein = calculateProteinTarget(latestWeight);

  const todayNutrition = state.nutritionLogs.find(n => n.date === today.toISOString().split('T')[0]);
  const pI = phaseInfo[phase];

  const statCards = [
    { label: 'Current Weight', value: `${latestWeight} lbs`, icon: '⚖️', sub: `Goal: ${USER_PROFILE.targetWeight} lbs` },
    { label: 'Lost So Far', value: `${Math.max(0, lostSoFar).toFixed(1)} lbs`, icon: '📉', sub: `${remaining.toFixed(1)} lbs to go` },
    { label: 'Daily Calories', value: `${targetCals}`, icon: '🔥', sub: `Protein: ${targetProtein}g target` },
    { label: 'Week', value: `Week ${calculateCurrentWeek(state.startDate)}`, icon: '📅', sub: `Phase ${phase}: ${pI.name}` },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Good {today.getHours() < 12 ? 'Morning' : today.getHours() < 17 ? 'Afternoon' : 'Evening'} 🌿</h1>
          <p className="subtitle">{DAY_NAMES[dayOfWeek]}, {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header-row">
          <span className="card-label">50-lb Journey Progress</span>
          <span className="card-label-right">{progressPct.toFixed(0)}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="progress-sub">{lostSoFar > 0 ? `You've lost ${lostSoFar.toFixed(1)} lbs!` : 'Log your first weight to track progress'} · {remaining.toFixed(1)} lbs remaining</p>
      </div>

      <div className="stats-grid">
        {statCards.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card phase-banner" style={{ borderLeft: `4px solid ${pI.color}` }}>
        <div className="phase-banner-content">
          <div>
            <span className="phase-badge" style={{ background: pI.color }}>Phase {phase} · {pI.name}</span>
            <p className="phase-focus">{pI.focus}</p>
          </div>
          <span className="phase-intensity" style={{ color: pI.color }}>{pI.intensity} Intensity</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header-row">
          <h2 className="card-title">💪 Today's Workout</h2>
          <button className="btn-link" onClick={() => setActiveTab('workouts')}>View full plan →</button>
        </div>
        {todayWorkout ? (
          <div>
            <div className="workout-preview-header">
              <span className="workout-type-chip">{todayWorkout.type.replace('_', ' ')}</span>
              <span className="workout-duration">⏱ {todayWorkout.duration}</span>
            </div>
            <h3 className="workout-preview-name">{todayWorkout.name}</h3>
            <p className="workout-preview-desc">{todayWorkout.description}</p>
            {todayWorkout.exerciseIds.length > 0 && (
              <div className="exercise-preview-list">
                {todayWorkout.exerciseIds.slice(0, 4).map(id => (
                  <span key={id} className="exercise-chip">{id}</span>
                ))}
                {todayWorkout.exerciseIds.length > 4 && (
                  <span className="exercise-chip more">+{todayWorkout.exerciseIds.length - 4} more</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="empty-state">No workout scheduled today — enjoy your rest day! 🛋️</p>
        )}
      </div>

      <div className="card">
        <div className="card-header-row">
          <h2 className="card-title">🥗 Today's Meal Plan</h2>
          <button className="btn-link" onClick={() => setActiveTab('meals')}>Browse meals →</button>
        </div>
        <div className="today-meals-grid">
          {[
            { label: '🌅 Breakfast', meal: todayMeals?.breakfast },
            { label: '☀️ Lunch', meal: todayMeals?.lunch },
            { label: '🌙 Dinner', meal: todayMeals?.dinner },
            { label: '🍎 Snack', meal: todayMeals?.snack },
          ].map(({ label, meal }) => (
            <div key={label} className="today-meal-card">
              <div className="today-meal-label">{label}</div>
              {meal ? (
                <>
                  <div className="today-meal-name">{meal.name}</div>
                  <div className="today-meal-macros">
                    <span>{meal.caloriesPerServing} cal</span>
                    <span>{meal.proteinPerServing}g protein</span>
                    <span>⏱ {meal.prepTime}min</span>
                  </div>
                </>
              ) : <div className="empty-state-small">–</div>}
            </div>
          ))}
        </div>
        <div className="today-totals">
          <span>Today's plan: ~{
            ((todayMeals?.breakfast?.caloriesPerServing ?? 0) +
            (todayMeals?.lunch?.caloriesPerServing ?? 0) +
            (todayMeals?.dinner?.caloriesPerServing ?? 0) +
            (todayMeals?.snack?.caloriesPerServing ?? 0))
          } cal · {targetCals} cal target</span>
        </div>
      </div>

      {todayNutrition && (
        <div className="card">
          <h2 className="card-title">📊 Today Logged</h2>
          <div className="logged-macros">
            <div className="macro-item">
              <div className="macro-value">{todayNutrition.totalCalories}</div>
              <div className="macro-label">Calories</div>
              <div className="macro-target">/{targetCals} target</div>
            </div>
            <div className="macro-item">
              <div className="macro-value">{todayNutrition.totalProtein}g</div>
              <div className="macro-label">Protein</div>
              <div className="macro-target">/{targetProtein}g target</div>
            </div>
            <div className="macro-item">
              <div className="macro-value">{todayNutrition.waterIntake}</div>
              <div className="macro-label">💧 Glasses</div>
              <div className="macro-target">/8 target</div>
            </div>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <button className="quick-btn" onClick={() => setActiveTab('journal')}>📝 Log Weight</button>
        <button className="quick-btn" onClick={() => setActiveTab('journal')}>🍽️ Log Food</button>
        <button className="quick-btn" onClick={() => setActiveTab('journal')}>💪 Log Workout</button>
        <button className="quick-btn" onClick={() => setActiveTab('progress')}>📊 View Progress</button>
      </div>
    </div>
  );
};

export default Dashboard;

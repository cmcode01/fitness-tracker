import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getWeeklyMealPlan } from '../data/meals';
import { getTodayWorkout, getExerciseById, phaseInfo } from '../data/workouts';
import { Meal } from '../types';
import {
  calculateBMR, calculateTDEE, calculateTargetCalories,
  calculateProteinTarget, calculateCurrentWeek,
  calculateAdjustedCalories, getWorkoutIntensity, scoreColor,
  USER_PROFILE, DAY_NAMES, todayStr,
} from '../utils/calculations';

type Mood = 'great' | 'good' | 'okay' | 'hard';

interface Props { setActiveTab: (tab: string) => void }

const MOOD_ICONS: Record<Mood, string> = { great: '🤩', good: '😊', okay: '😐', hard: '😓' };
const MEAL_ICONS = ['🌅', '☀️', '🌙', '🍎'];
const MEAL_LABELS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const Dashboard: React.FC<Props> = ({ setActiveTab }) => {
  const { state, dispatch, activeProfile, syncOura } = useApp();

  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [logWorkoutOpen, setLogWorkoutOpen] = useState(false);
  const [logForm, setLogForm] = useState<{ duration: number; mood: Mood; notes: string }>({ duration: 45, mood: 'good', notes: '' });
  const [mealPortions, setMealPortions] = useState<Record<string, number>>({});
  const [weightInput, setWeightInput] = useState('');
  const [syncing, setSyncing] = useState(false);

  const today = todayStr();
  const now = new Date();
  const dayOfWeek = now.getDay();
  const phase = state.currentPhase;
  const weekNumber = calculateCurrentWeek(state.startDate) - 1;
  const pI = phaseInfo[phase];

  const todayWorkout = getTodayWorkout(phase, dayOfWeek);
  const todayMeals = getWeeklyMealPlan(weekNumber)[dayOfWeek];
  const todayNutrition = state.nutritionLogs.find(n => n.date === today);
  const workoutLoggedToday = state.workoutLogs.find(w => w.date === today);

  // Use active profile data when available
  const profile = activeProfile;
  const startWeight = profile?.startWeight ?? USER_PROFILE.startWeight;
  const targetWeight = profile?.goalWeight ?? USER_PROFILE.targetWeight;
  const heightInches = profile?.heightInches ?? USER_PROFILE.heightInches;
  const age = profile?.age ?? USER_PROFILE.age;

  const latestWeight = [...state.weightLogs].sort((a, b) => b.date.localeCompare(a.date))[0]?.weight ?? startWeight;
  const lostSoFar = startWeight - latestWeight;
  const totalToLose = startWeight - targetWeight;
  const progressPct = Math.min(100, Math.max(0, totalToLose > 0 ? (lostSoFar / totalToLose) * 100 : 0));

  const bmr = calculateBMR(latestWeight, heightInches, age);
  const baseCals = calculateTargetCalories(calculateTDEE(bmr, profile?.activityLevel), profile?.fitnessGoal);
  const targetProtein = calculateProteinTarget(latestWeight, profile?.fitnessGoal);

  // Today's Oura health data
  const todayHealth = state.healthDataLogs.find(h => h.date === today && h.profileId === state.activeProfileId) ?? null;
  const { adjustedTarget: targetCals, delta: calDelta, reason: calReason } = calculateAdjustedCalories(baseCals, todayHealth);
  const workoutIntensity = getWorkoutIntensity(todayHealth?.readinessScore);

  const waterLogged = todayNutrition?.waterIntake ?? 0;
  const calsLogged = todayNutrition?.totalCalories ?? 0;
  const proteinLogged = todayNutrition?.totalProtein ?? 0;

  const getMealPortion = (mealId: string) => mealPortions[mealId] ?? 1.0;

  const isMealLogged = (meal: Meal) =>
    todayNutrition?.meals.some(m => m.mealId === meal.id) ?? false;

  const handleLogMeal = (meal: Meal) => {
    const portion = getMealPortion(meal.id);
    const newMeal = {
      mealId: meal.id, mealName: meal.name, portionMultiplier: portion,
      calories: Math.round(meal.caloriesPerServing * portion),
      protein: Math.round(meal.proteinPerServing * portion),
    };
    const existingMeals = todayNutrition?.meals ?? [];
    const meals = [...existingMeals, newMeal];
    dispatch({
      type: 'ADD_NUTRITION_LOG',
      payload: {
        date: today, meals,
        waterIntake: todayNutrition?.waterIntake ?? 0,
        totalCalories: meals.reduce((s, m) => s + m.calories, 0),
        totalProtein: meals.reduce((s, m) => s + m.protein, 0),
        notes: todayNutrition?.notes,
      },
    });
  };

  const handleDeleteLoggedMeal = (mealIndex: number) => {
    dispatch({ type: 'DELETE_MEAL_FROM_LOG', payload: { date: today, mealIndex } });
  };

  const handleSetWater = (glasses: number) => {
    dispatch({
      type: 'ADD_NUTRITION_LOG',
      payload: {
        date: today,
        meals: todayNutrition?.meals ?? [],
        waterIntake: glasses,
        totalCalories: todayNutrition?.totalCalories ?? 0,
        totalProtein: todayNutrition?.totalProtein ?? 0,
        notes: todayNutrition?.notes,
      },
    });
  };

  const handleLogWorkout = () => {
    if (!todayWorkout) return;
    dispatch({
      type: 'ADD_WORKOUT_LOG',
      payload: {
        date: today, workoutName: todayWorkout.name, phase,
        duration: logForm.duration, completedExercises: todayWorkout.exerciseIds,
        mood: logForm.mood, notes: logForm.notes,
      },
    });
    setLogWorkoutOpen(false);
    setLogForm({ duration: 45, mood: 'good', notes: '' });
  };

  const handleLogWeight = () => {
    const w = parseFloat(weightInput);
    if (!weightInput || isNaN(w)) return;
    dispatch({ type: 'ADD_WEIGHT', payload: { date: today, weight: w } });
    setWeightInput('');
  };

  const handleSyncOura = async () => {
    setSyncing(true);
    await syncOura();
    setSyncing(false);
  };

  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="today-header">
        <div>
          <h1>{greeting} {profile ? profile.avatarEmoji : '🌿'}</h1>
          <p className="subtitle">
            {profile ? `${profile.name} · ` : ''}
            {DAY_NAMES[dayOfWeek]}, {now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} · Week {calculateCurrentWeek(state.startDate)} · <span style={{ color: pI.color }}>Phase {phase}: {pI.name}</span>
          </p>
        </div>
      </div>

      {/* ── Oura Health Data ── */}
      {(todayHealth || state.ouraToken) && (
        <div className="card">
          <div className="card-header-row">
            <h2 className="card-title">Oura Ring — Today</h2>
            {state.ouraToken && (
              <button className="btn-link" onClick={handleSyncOura} disabled={syncing}>
                {syncing ? 'Syncing…' : '↻ Sync'}
              </button>
            )}
          </div>
          {todayHealth ? (
            <div className="health-scores-row">
              {todayHealth.readinessScore !== undefined && (
                <div className="health-score-item">
                  <div className="health-score-val" style={{ color: scoreColor(todayHealth.readinessScore) }}>
                    {todayHealth.readinessScore}
                  </div>
                  <div className="health-score-label">Readiness</div>
                </div>
              )}
              {todayHealth.sleepScore !== undefined && (
                <div className="health-score-item">
                  <div className="health-score-val" style={{ color: scoreColor(todayHealth.sleepScore) }}>
                    {todayHealth.sleepScore}
                  </div>
                  <div className="health-score-label">Sleep</div>
                </div>
              )}
              {todayHealth.activityScore !== undefined && (
                <div className="health-score-item">
                  <div className="health-score-val" style={{ color: scoreColor(todayHealth.activityScore) }}>
                    {todayHealth.activityScore}
                  </div>
                  <div className="health-score-label">Activity</div>
                </div>
              )}
              {todayHealth.sleepDurationHours !== undefined && (
                <div className="health-score-item">
                  <div className="health-score-val">{todayHealth.sleepDurationHours.toFixed(1)}h</div>
                  <div className="health-score-label">Sleep time</div>
                </div>
              )}
              {todayHealth.caloriesBurned !== undefined && (
                <div className="health-score-item">
                  <div className="health-score-val">{todayHealth.caloriesBurned}</div>
                  <div className="health-score-label">Cal burned</div>
                </div>
              )}
              {todayHealth.steps !== undefined && (
                <div className="health-score-item">
                  <div className="health-score-val">{todayHealth.steps.toLocaleString()}</div>
                  <div className="health-score-label">Steps</div>
                </div>
              )}
            </div>
          ) : (
            <p className="empty-state">No data yet — tap Sync to pull today's Oura data.</p>
          )}
          {calDelta !== 0 && calReason && (
            <div className="health-adjustment-note">
              Calorie target adjusted: {calDelta > 0 ? '+' : ''}{calDelta} cal due to {calReason}
            </div>
          )}
          {workoutIntensity === 'rest' && (
            <div className="health-adjustment-note warning">
              Low readiness ({todayHealth?.readinessScore}) — consider a rest day or light activity today.
            </div>
          )}
          {workoutIntensity === 'reduced' && (
            <div className="health-adjustment-note">
              Moderate readiness ({todayHealth?.readinessScore}) — reduced intensity workout recommended.
            </div>
          )}
        </div>
      )}

      {/* ── Progress bar ── */}
      <div className="card mb-4">
        <div className="card-header-row">
          <span className="card-label">{totalToLose}-lb Journey</span>
          <span className="card-label-right">{progressPct.toFixed(0)}% · {latestWeight} lbs</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="progress-sub">{lostSoFar > 0 ? `${lostSoFar.toFixed(1)} lbs lost` : 'Log your first weight to start tracking'} · {(latestWeight - targetWeight).toFixed(1)} lbs to go</p>
      </div>

      {/* ── Today's logged macros ── */}
      {todayNutrition && (
        <div className="today-macros-bar card">
          <div className="tmb-item">
            <div className="tmb-val">{calsLogged}</div>
            <div className="tmb-bar-wrap"><div className="tmb-bar" style={{ width: `${Math.min(100, (calsLogged / targetCals) * 100)}%`, background: 'var(--purple)' }} /></div>
            <div className="tmb-label">{targetCals} cal target{calDelta !== 0 ? ` (adj)` : ''}</div>
          </div>
          <div className="tmb-item">
            <div className="tmb-val">{proteinLogged}g</div>
            <div className="tmb-bar-wrap"><div className="tmb-bar" style={{ width: `${Math.min(100, (proteinLogged / targetProtein) * 100)}%`, background: 'var(--teal)' }} /></div>
            <div className="tmb-label">{targetProtein}g protein target</div>
          </div>
          <div className="tmb-item">
            <div className="tmb-val">💧 {waterLogged}</div>
            <div className="tmb-bar-wrap"><div className="tmb-bar" style={{ width: `${Math.min(100, (waterLogged / 8) * 100)}%`, background: 'var(--blue)' }} /></div>
            <div className="tmb-label">8 glasses target</div>
          </div>
        </div>
      )}

      {/* ── Logged Meals Today (with delete) ── */}
      {todayNutrition && todayNutrition.meals.length > 0 && (
        <div className="card">
          <h2 className="card-title">Logged Meals Today</h2>
          <div className="logged-meals-list">
            {todayNutrition.meals.map((m, i) => (
              <div key={i} className="logged-meal-row">
                <div className="logged-meal-info">
                  <span className="logged-meal-name">{m.mealName}</span>
                  <span className="logged-meal-meta">{m.portionMultiplier}× · {m.calories} cal · {m.protein}g protein</span>
                </div>
                <button
                  className="btn-icon-del"
                  onClick={() => handleDeleteLoggedMeal(i)}
                  title="Remove this meal"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Today's Workout ── */}
      <div className="card">
        <div className="card-header-row">
          <h2 className="card-title">💪 Today's Workout</h2>
          {workoutLoggedToday && (
            <span className="logged-badge">✓ Logged {MOOD_ICONS[workoutLoggedToday.mood ?? 'good']}</span>
          )}
        </div>

        {!todayWorkout ? (
          <p className="empty-state">Rest day — enjoy the recovery! 🛋️</p>
        ) : (
          <>
            <div className="workout-today-meta">
              <span className="workout-type-chip">{todayWorkout.type.replace('_', ' ')}</span>
              <span className="workout-duration-chip">⏱ {todayWorkout.duration}</span>
              {workoutIntensity === 'reduced' && <span className="workout-type-chip" style={{ background: '#f59e0b22', color: '#f59e0b' }}>Reduced intensity</span>}
              {workoutIntensity === 'rest' && <span className="workout-type-chip" style={{ background: '#ef444422', color: '#ef4444' }}>Rest recommended</span>}
            </div>
            <h3 className="workout-today-name">{todayWorkout.name}</h3>
            <p className="workout-today-desc">{todayWorkout.description}</p>
            {todayWorkout.cardioNotes && (
              <div className="cardio-note">📋 {todayWorkout.cardioNotes}</div>
            )}

            {todayWorkout.exerciseIds.length > 0 && (
              <div className="today-exercises">
                <p className="today-exercises-label">Exercises — tap to expand</p>
                {todayWorkout.exerciseIds.map(id => {
                  const ex = getExerciseById(id);
                  if (!ex) return null;
                  const open = expandedExercise === id;
                  return (
                    <button
                      key={id}
                      className={`exercise-item ${open ? 'expanded' : ''}`}
                      onClick={() => setExpandedExercise(open ? null : id)}
                    >
                      <div className="exercise-item-header">
                        <div>
                          <div className="exercise-item-name">{ex.name}</div>
                          <div className="exercise-item-meta">
                            {ex.sets && <span>{ex.sets} sets</span>}
                            {ex.reps && <span>× {ex.reps}</span>}
                            {ex.duration && <span>⏱ {ex.duration}</span>}
                            <span className="exercise-muscles">{ex.targetMuscles.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                        <span className="ex-chevron">{open ? '▲' : '▼'}</span>
                      </div>
                      {open && (
                        <div className="exercise-detail">
                          <div className="exercise-section"><strong>How to do it:</strong><p>{ex.instructions}</p></div>
                          <div className="exercise-section acl-note"><strong>🦵 ACL Modification:</strong><p>{ex.aclModification}</p></div>
                          <div className="exercise-section"><strong>Equipment:</strong> {ex.equipment.join(', ')}</div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {!workoutLoggedToday && (
              <>
                {!logWorkoutOpen ? (
                  <button className="btn-primary log-workout-btn" onClick={() => setLogWorkoutOpen(true)}>
                    Log This Workout
                  </button>
                ) : (
                  <div className="log-workout-inline">
                    <div className="lwi-row">
                      <div className="form-group">
                        <label>Duration (min)</label>
                        <input type="number" className="form-input" min={5} max={180}
                          value={logForm.duration} onChange={e => setLogForm(p => ({ ...p, duration: +e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>How did it feel?</label>
                        <div className="mood-buttons">
                          {(['great', 'good', 'okay', 'hard'] as Mood[]).map(m => (
                            <button key={m} className={`mood-btn ${logForm.mood === m ? 'selected' : ''}`}
                              onClick={() => setLogForm(p => ({ ...p, mood: m }))}>
                              {MOOD_ICONS[m]} {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Notes (optional)</label>
                      <input type="text" className="form-input" placeholder="Any modifications or highlights?"
                        value={logForm.notes} onChange={e => setLogForm(p => ({ ...p, notes: e.target.value }))} />
                    </div>
                    <div className="lwi-actions">
                      <button className="btn-secondary" onClick={() => setLogWorkoutOpen(false)}>Cancel</button>
                      <button className="btn-primary" onClick={handleLogWorkout}>Save Workout</button>
                    </div>
                  </div>
                )}
              </>
            )}
            {workoutLoggedToday && (
              <div className="already-logged-note">
                Logged {workoutLoggedToday.duration} min · {MOOD_ICONS[workoutLoggedToday.mood ?? 'good']} {workoutLoggedToday.mood}
                {workoutLoggedToday.notes && <> · "{workoutLoggedToday.notes}"</>}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Today's Meals ── */}
      <div className="card">
        <div className="card-header-row">
          <h2 className="card-title">🥗 Today's Meals</h2>
          <button className="btn-link" onClick={() => setActiveTab('meals')}>Browse all →</button>
        </div>

        <div className="today-meal-slots">
          {([todayMeals?.breakfast, todayMeals?.lunch, todayMeals?.dinner, todayMeals?.snack] as (Meal | undefined)[]).map((meal, i) => {
            if (!meal) return (
              <div key={i} className="meal-slot empty-slot">
                <div className="meal-slot-icon">{MEAL_ICONS[i]}</div>
                <div className="meal-slot-label">{MEAL_LABELS[i]}</div>
                <p className="meal-slot-empty">No meal planned</p>
              </div>
            );

            const portion = getMealPortion(meal.id);
            const logged = isMealLogged(meal);
            const feedback = state.mealFeedback[meal.id];
            return (
              <div key={meal.id} className={`meal-slot ${logged ? 'meal-logged' : ''}`}>
                <div className="meal-slot-top">
                  <div className="meal-slot-icon">{MEAL_ICONS[i]}</div>
                  <div className="meal-slot-label">{MEAL_LABELS[i]}</div>
                  {logged && <span className="meal-logged-chip">✓ Logged</span>}
                  {feedback?.reaction === 'liked' && <span style={{ fontSize: '0.75rem' }}>❤️</span>}
                  {feedback?.reaction === 'disliked' && <span style={{ fontSize: '0.75rem' }}>👎</span>}
                </div>
                <div className="meal-slot-name">{meal.name}</div>
                <div className="meal-slot-meta">
                  {Math.round(meal.caloriesPerServing * portion)} cal · {Math.round(meal.proteinPerServing * portion)}g protein · ⏱ {meal.prepTime} min
                </div>

                <div className="meal-slot-controls">
                  <div className="portion-row">
                    {[0.5, 1, 1.5, 2].map(p => (
                      <button key={p}
                        className={`portion-btn-sm ${portion === p ? 'active' : ''}`}
                        onClick={() => setMealPortions(prev => ({ ...prev, [meal.id]: p }))}>
                        {p}×
                      </button>
                    ))}
                  </div>
                  <button className="btn-log-meal" onClick={() => handleLogMeal(meal)}>
                    {logged ? '+ Log again' : 'Log meal'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="plan-totals">
          Planned today: ~{
            ((todayMeals?.breakfast?.caloriesPerServing ?? 0) +
             (todayMeals?.lunch?.caloriesPerServing ?? 0) +
             (todayMeals?.dinner?.caloriesPerServing ?? 0) +
             (todayMeals?.snack?.caloriesPerServing ?? 0))
          } cal · target {targetCals} cal{calDelta !== 0 ? ` (adjusted from ${baseCals})` : ''}
        </div>
      </div>

      {/* ── Water Intake ── */}
      <div className="card">
        <h2 className="card-title">💧 Water Intake — {waterLogged} / 8 glasses</h2>
        <div className="water-glasses">
          {Array.from({ length: 8 }, (_, i) => (
            <button
              key={i}
              className={`water-glass ${i < waterLogged ? 'filled' : ''}`}
              onClick={() => handleSetWater(i < waterLogged ? i : i + 1)}
              title={`${i + 1} glass${i > 0 ? 'es' : ''}`}
            >
              💧
            </button>
          ))}
        </div>
        <p className="water-hint">Tap a glass to fill / tap a filled glass to reduce</p>
      </div>

      {/* ── Quick Weight Entry ── */}
      <div className="card">
        <h2 className="card-title">⚖️ Log Today's Weight</h2>
        <div className="quick-weight-row">
          <input
            type="number"
            step="0.1"
            className="form-input quick-weight-input"
            placeholder={`${latestWeight} lbs (last)`}
            value={weightInput}
            onChange={e => setWeightInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogWeight()}
          />
          <button className="btn-primary" onClick={handleLogWeight} disabled={!weightInput}>Save</button>
        </div>
        {state.weightLogs.length > 0 && (
          <p className="quick-weight-sub">
            Last logged: {[...state.weightLogs].sort((a, b) => b.date.localeCompare(a.date))[0].weight} lbs
          </p>
        )}
      </div>

      {/* ── Quick links ── */}
      <div className="quick-actions">
        <button className="quick-btn" onClick={() => setActiveTab('workouts')}>📅 Full Workout Plan</button>
        <button className="quick-btn" onClick={() => setActiveTab('meals')}>🔍 Browse Meals</button>
        <button className="quick-btn" onClick={() => setActiveTab('journal')}>📓 Full Journal</button>
        <button className="quick-btn" onClick={() => setActiveTab('progress')}>📊 Progress Charts</button>
      </div>
    </div>
  );
};

export default Dashboard;

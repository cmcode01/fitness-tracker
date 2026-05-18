import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { meals } from '../data/meals';
import { Meal, NutritionLogMeal } from '../types';
import { todayStr, formatDate, generateId } from '../utils/calculations';

type JournalTab = 'weight' | 'measurements' | 'nutrition' | 'workout-history';

const Journal: React.FC = () => {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState<JournalTab>('weight');

  const [weightForm, setWeightForm] = useState({ date: todayStr(), weight: '', notes: '' });
  const [measForm, setMeasForm] = useState({ date: todayStr(), chest: '', waist: '', hips: '', rightArm: '', leftArm: '', rightThigh: '', leftThigh: '', notes: '' });
  const [nutForm, setNutForm] = useState({ date: todayStr(), waterIntake: 0, selectedMeals: [] as NutritionLogMeal[], notes: '' });
  const [mealPortion, setMealPortion] = useState(1.0);
  const [mealSearch, setMealSearch] = useState('');

  const searchedMeals = meals.filter(m =>
    m.name.toLowerCase().includes(mealSearch.toLowerCase()) ||
    m.cuisine.toLowerCase().includes(mealSearch.toLowerCase())
  ).slice(0, 8);

  const addMealToLog = (meal: Meal) => {
    const entry: NutritionLogMeal = {
      mealId: meal.id, mealName: meal.name, portionMultiplier: mealPortion,
      calories: Math.round(meal.caloriesPerServing * mealPortion),
      protein: Math.round(meal.proteinPerServing * mealPortion),
    };
    setNutForm(p => ({ ...p, selectedMeals: [...p.selectedMeals, entry] }));
    setMealSearch('');
  };

  const totalCals = nutForm.selectedMeals.reduce((s, m) => s + m.calories, 0);
  const totalProt = nutForm.selectedMeals.reduce((s, m) => s + m.protein, 0);

  const submitWeight = () => {
    if (!weightForm.weight) return;
    dispatch({ type: 'ADD_WEIGHT', payload: { date: weightForm.date, weight: parseFloat(weightForm.weight), notes: weightForm.notes } });
    setWeightForm({ date: todayStr(), weight: '', notes: '' });
    alert('Weight logged! ✅');
  };

  const submitMeasurements = () => {
    const payload: any = { date: measForm.date, notes: measForm.notes };
    ['chest', 'waist', 'hips', 'rightArm', 'leftArm', 'rightThigh', 'leftThigh'].forEach(k => {
      if ((measForm as any)[k]) payload[k] = parseFloat((measForm as any)[k]);
    });
    dispatch({ type: 'ADD_MEASUREMENT', payload });
    setMeasForm({ date: todayStr(), chest: '', waist: '', hips: '', rightArm: '', leftArm: '', rightThigh: '', leftThigh: '', notes: '' });
    alert('Measurements logged! ✅');
  };

  const submitNutrition = () => {
    if (nutForm.selectedMeals.length === 0 && nutForm.waterIntake === 0) return;
    dispatch({
      type: 'ADD_NUTRITION_LOG',
      payload: { date: nutForm.date, meals: nutForm.selectedMeals, waterIntake: nutForm.waterIntake, totalCalories: totalCals, totalProtein: totalProt, notes: nutForm.notes }
    });
    setNutForm({ date: todayStr(), waterIntake: 0, selectedMeals: [], notes: '' });
    alert('Nutrition logged! ✅');
  };

  const sortedWeights = [...state.weightLogs].sort((a, b) => b.date.localeCompare(a.date));
  const sortedWorkouts = [...state.workoutLogs].sort((a, b) => b.date.localeCompare(a.date));
  const sortedMeasurements = [...state.measurementLogs].sort((a, b) => b.date.localeCompare(a.date));
  const sortedNutrition = [...state.nutritionLogs].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="page">
      <div className="page-header">
        <h1>📓 Journal</h1>
        <p className="subtitle">Track your weight, measurements, nutrition, and workouts</p>
      </div>

      <div className="journal-tabs">
        {(['weight', 'measurements', 'nutrition', 'workout-history'] as JournalTab[]).map(t => (
          <button key={t} className={`journal-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'weight' ? '⚖️ Weight' : t === 'measurements' ? '📏 Measurements' : t === 'nutrition' ? '🍽️ Nutrition' : '💪 Workouts'}
          </button>
        ))}
      </div>

      {tab === 'weight' && (
        <div>
          <div className="card">
            <h2 className="card-title">Log Weight</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-input" value={weightForm.date} onChange={e => setWeightForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Weight (lbs)</label>
                <input type="number" className="form-input" value={weightForm.weight} step="0.1" placeholder="e.g. 189.5" onChange={e => setWeightForm(p => ({ ...p, weight: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label>Notes (optional)</label>
              <input type="text" className="form-input" value={weightForm.notes} placeholder="Time of day, conditions..." onChange={e => setWeightForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <button className="btn-primary" onClick={submitWeight}>Save Weight</button>
          </div>
          {sortedWeights.length > 0 && (
            <div className="card">
              <h2 className="card-title">Weight History</h2>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Weight</th><th>Change</th><th>Notes</th><th></th></tr></thead>
                  <tbody>
                    {sortedWeights.map((entry, i) => {
                      const prev = sortedWeights[i + 1];
                      const change = prev ? entry.weight - prev.weight : null;
                      return (
                        <tr key={entry.id}>
                          <td>{formatDate(entry.date)}</td>
                          <td><strong>{entry.weight} lbs</strong></td>
                          <td className={change === null ? '' : change < 0 ? 'text-green' : change > 0 ? 'text-red' : ''}>
                            {change !== null ? `${change > 0 ? '+' : ''}${change.toFixed(1)} lbs` : '—'}
                          </td>
                          <td>{entry.notes ?? '—'}</td>
                          <td><button className="btn-icon-del" onClick={() => dispatch({ type: 'DELETE_WEIGHT', payload: entry.id })}>✕</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'measurements' && (
        <div>
          <div className="card">
            <h2 className="card-title">Log Measurements</h2>
            <p className="form-note">Measure in inches. Log all or just the ones you measured today.</p>
            <div className="form-group">
              <label>Date</label>
              <input type="date" className="form-input" value={measForm.date} onChange={e => setMeasForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="form-row-3">
              {[['chest','Chest (in)'],['waist','Waist (in)'],['hips','Hips (in)'],['rightArm','Right Arm (in)'],['leftArm','Left Arm (in)'],['rightThigh','Right Thigh (in)'],['leftThigh','Left Thigh (in)']].map(([key, label]) => (
                <div key={key} className="form-group">
                  <label>{label}</label>
                  <input type="number" step="0.25" className="form-input" placeholder="0.0"
                    value={(measForm as any)[key]} onChange={e => setMeasForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input type="text" className="form-input" value={measForm.notes} onChange={e => setMeasForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <button className="btn-primary" onClick={submitMeasurements}>Save Measurements</button>
          </div>
          {sortedMeasurements.length > 0 && (
            <div className="card">
              <h2 className="card-title">Measurement History</h2>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Waist</th><th>Hips</th><th>Chest</th><th>Arms</th><th>Thighs</th></tr></thead>
                  <tbody>
                    {sortedMeasurements.map(m => (
                      <tr key={m.id}>
                        <td>{formatDate(m.date)}</td>
                        <td>{m.waist ? `${m.waist}"` : '—'}</td>
                        <td>{m.hips ? `${m.hips}"` : '—'}</td>
                        <td>{m.chest ? `${m.chest}"` : '—'}</td>
                        <td>{m.rightArm ? `${m.rightArm}" / ${m.leftArm}"` : '—'}</td>
                        <td>{m.rightThigh ? `${m.rightThigh}" / ${m.leftThigh}"` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'nutrition' && (
        <div>
          <div className="card">
            <h2 className="card-title">Log Today's Nutrition</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-input" value={nutForm.date} onChange={e => setNutForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>💧 Water (glasses)</label>
                <input type="number" className="form-input" min={0} max={20} value={nutForm.waterIntake} onChange={e => setNutForm(p => ({ ...p, waterIntake: +e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label>Add Meal</label>
              <div className="meal-search-row">
                <input type="text" className="form-input" placeholder="Search meal name or cuisine..." value={mealSearch} onChange={e => setMealSearch(e.target.value)} />
                <div className="portion-inline">
                  <label>Portion:</label>
                  {[0.5, 1, 1.5, 2].map(p => (
                    <button key={p} className={`portion-btn-sm ${mealPortion === p ? 'active' : ''}`} onClick={() => setMealPortion(p)}>{p}x</button>
                  ))}
                </div>
              </div>
              {mealSearch && (
                <div className="meal-search-results">
                  {searchedMeals.length === 0
                    ? <div className="no-results">No meals found</div>
                    : searchedMeals.map(m => (
                      <button key={m.id} className="meal-search-result" onClick={() => addMealToLog(m)}>
                        <span>{m.name}</span>
                        <span className="meal-search-meta">{m.caloriesPerServing} cal · {m.proteinPerServing}g protein</span>
                      </button>
                    ))
                  }
                </div>
              )}
            </div>
            {nutForm.selectedMeals.length > 0 && (
              <div className="selected-meals">
                {nutForm.selectedMeals.map((m, i) => (
                  <div key={i} className="selected-meal-item">
                    <div><strong>{m.mealName}</strong><span className="selected-meal-portion"> ({m.portionMultiplier}x)</span></div>
                    <div className="selected-meal-right">
                      <span>{m.calories} cal · {m.protein}g protein</span>
                      <button className="btn-icon-del" onClick={() => setNutForm(p => ({ ...p, selectedMeals: p.selectedMeals.filter((_, idx) => idx !== i) }))}>✕</button>
                    </div>
                  </div>
                ))}
                <div className="nutrition-totals"><strong>Total: {totalCals} cal · {totalProt}g protein</strong></div>
              </div>
            )}
            <div className="form-group">
              <label>Notes</label>
              <textarea className="form-input form-textarea" value={nutForm.notes} placeholder="How did you feel? Any cravings?" onChange={e => setNutForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <button className="btn-primary" onClick={submitNutrition}>Save Nutrition Log</button>
          </div>
          {sortedNutrition.length > 0 && (
            <div className="card">
              <h2 className="card-title">Nutrition History</h2>
              {sortedNutrition.map(log => (
                <div key={log.id} className="nutrition-log-entry">
                  <div className="nutrition-log-header">
                    <strong>{formatDate(log.date)}</strong>
                    <span>{log.totalCalories} cal · {log.totalProtein}g protein · 💧 {log.waterIntake} glasses</span>
                  </div>
                  <div className="nutrition-log-meals">
                    {log.meals.map((m, i) => <span key={i} className="nutrition-meal-chip">{m.mealName} ({m.portionMultiplier}x)</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'workout-history' && (
        <div>
          {sortedWorkouts.length === 0 ? (
            <div className="card"><p className="empty-state">No workouts logged yet. Go complete today's workout! 💪</p></div>
          ) : (
            <div className="card">
              <h2 className="card-title">Workout History</h2>
              {sortedWorkouts.map(log => (
                <div key={log.id} className="workout-log-entry">
                  <div className="workout-log-header">
                    <div>
                      <strong>{log.workoutName}</strong>
                      <span className="workout-log-phase"> Phase {log.phase}</span>
                    </div>
                    <div className="workout-log-right">
                      <span>{formatDate(log.date)}</span>
                      <span className="workout-duration-chip">⏱ {log.duration} min</span>
                      {log.mood && <span className="mood-chip">{log.mood === 'great' ? '🤩' : log.mood === 'good' ? '😊' : log.mood === 'okay' ? '😐' : '😓'}</span>}
                    </div>
                  </div>
                  {log.notes && <p className="workout-log-notes">{log.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Journal;

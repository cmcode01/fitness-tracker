import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { meals } from '../data/meals';
import { phaseInfo } from '../data/workouts';
import { USER_PROFILE, calculateCurrentWeek, formatDate } from '../utils/calculations';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';

const Progress: React.FC = () => {
  const { state } = useApp();
  const [chartView, setChartView] = useState<'weight' | 'measurements' | 'nutrition' | 'workouts'>('weight');

  const sortedWeights = [...state.weightLogs].sort((a, b) => a.date.localeCompare(b.date));
  const sortedMeasurements = [...state.measurementLogs].sort((a, b) => a.date.localeCompare(b.date));
  const sortedNutrition = [...state.nutritionLogs].sort((a, b) => a.date.localeCompare(b.date));
  const sortedWorkouts = [...state.workoutLogs].sort((a, b) => a.date.localeCompare(b.date));

  const weightData = sortedWeights.map(w => ({
    date: formatDate(w.date),
    weight: w.weight,
    target: USER_PROFILE.targetWeight,
  }));

  const measData = sortedMeasurements.map(m => ({
    date: formatDate(m.date),
    waist: m.waist,
    hips: m.hips,
    chest: m.chest,
  }));

  const nutData = sortedNutrition.slice(-14).map(n => ({
    date: formatDate(n.date),
    calories: n.totalCalories,
    protein: n.totalProtein,
  }));

  const workoutsByWeek: Record<string, number> = {};
  sortedWorkouts.forEach(w => {
    const d = new Date(w.date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split('T')[0];
    workoutsByWeek[key] = (workoutsByWeek[key] ?? 0) + 1;
  });
  const workoutData = Object.entries(workoutsByWeek).map(([date, count]) => ({
    date: formatDate(date),
    workouts: count,
  }));

  const currentWeek = calculateCurrentWeek(state.startDate);
  const latestWeight = sortedWeights[sortedWeights.length - 1]?.weight ?? USER_PROFILE.startWeight;
  const lostSoFar = USER_PROFILE.startWeight - latestWeight;
  const progressPct = Math.min(100, Math.max(0, (lostSoFar / (USER_PROFILE.startWeight - USER_PROFILE.targetWeight)) * 100));

  const likedMeals = Object.entries(state.mealFeedback)
    .filter(([, f]) => f.reaction === 'liked')
    .map(([id, f]) => ({ name: meals.find(m => m.id === id)?.name ?? id, rating: f.rating }));

  const dislikedMeals = Object.entries(state.mealFeedback)
    .filter(([, f]) => f.reaction === 'disliked')
    .map(([id]) => meals.find(m => m.id === id)?.name ?? id);

  const topRated = Object.entries(state.mealFeedback)
    .filter(([, f]) => f.rating >= 4)
    .sort(([, a], [, b]) => b.rating - a.rating)
    .slice(0, 5)
    .map(([id, f]) => ({ name: meals.find(m => m.id === id)?.name ?? id, rating: f.rating }));

  const pI = phaseInfo[state.currentPhase];

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 Progress</h1>
        <p className="subtitle">Your journey at a glance — Week {currentWeek}</p>
      </div>

      <div className="card mb-4">
        <div className="card-header-row">
          <span className="card-label">50-lb Journey Progress</span>
          <span className="card-label-right">{progressPct.toFixed(0)}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="progress-stats-row">
          <div className="progress-stat"><strong>{USER_PROFILE.startWeight} lbs</strong><span>Start</span></div>
          <div className="progress-stat highlight"><strong>{latestWeight} lbs</strong><span>Current</span></div>
          <div className="progress-stat"><strong>{USER_PROFILE.targetWeight} lbs</strong><span>Goal</span></div>
        </div>
        <p className="progress-sub">
          {lostSoFar > 0 ? `${lostSoFar.toFixed(1)} lbs lost` : 'Log your first weight to start tracking'} · {(latestWeight - USER_PROFILE.targetWeight).toFixed(1)} lbs remaining
        </p>
      </div>

      <div className="phase-progress-card card">
        <h2 className="card-title">Training Phase Progress</h2>
        <div className="phase-progress-grid">
          {([1, 2, 3, 4] as const).map(p => {
            const pi = phaseInfo[p];
            const isActive = p === state.currentPhase;
            const isPast = p < state.currentPhase;
            return (
              <div key={p} className={`phase-progress-item ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                style={{ borderColor: isActive ? pi.color : undefined }}>
                <div className="phase-progress-num" style={{ color: isActive || isPast ? pi.color : undefined }}>
                  {isPast ? '✓' : `${p}`}
                </div>
                <div className="phase-progress-name">{pi.name}</div>
                <div className="phase-progress-weeks">{pi.weeks}</div>
                {isActive && <div className="current-phase-badge" style={{ background: pi.color }}>Active</div>}
              </div>
            );
          })}
        </div>
        <div className="phase-focus-note" style={{ borderLeftColor: pI.color }}>
          <strong>Current focus:</strong> {pI.focus}
        </div>
      </div>

      <div className="card">
        <div className="chart-tabs">
          {([
            ['weight', '⚖️ Weight'],
            ['measurements', '📏 Measurements'],
            ['nutrition', '🍽️ Nutrition'],
            ['workouts', '💪 Workouts'],
          ] as const).map(([v, label]) => (
            <button key={v} className={`chart-tab ${chartView === v ? 'active' : ''}`} onClick={() => setChartView(v)}>
              {label}
            </button>
          ))}
        </div>

        {chartView === 'weight' && (
          <div>
            <h2 className="card-title">Weight Over Time</h2>
            {weightData.length < 2 ? (
              <p className="empty-state">Log at least 2 weight entries to see your trend.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weightData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <ReferenceLine y={USER_PROFILE.targetWeight} stroke="#3CAE63" strokeDasharray="6 3" label={{ value: 'Goal', position: 'right', fontSize: 11, fill: '#3CAE63' }} />
                  <Line type="monotone" dataKey="weight" stroke="#0E0E55" strokeWidth={2} dot={{ r: 4 }} name="Weight (lbs)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {chartView === 'measurements' && (
          <div>
            <h2 className="card-title">Body Measurements</h2>
            {measData.length < 2 ? (
              <p className="empty-state">Log at least 2 measurement entries to see your trend.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={measData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit='"' />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="waist" stroke="#0E0E55" strokeWidth={2} dot={{ r: 3 }} name="Waist" connectNulls />
                  <Line type="monotone" dataKey="hips" stroke="#3CAE63" strokeWidth={2} dot={{ r: 3 }} name="Hips" connectNulls />
                  <Line type="monotone" dataKey="chest" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Chest" connectNulls />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {chartView === 'nutrition' && (
          <div>
            <h2 className="card-title">Last 14 Days — Nutrition</h2>
            {nutData.length === 0 ? (
              <p className="empty-state">No nutrition logs yet. Start logging meals in the Journal!</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={nutData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="cal" orientation="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="prot" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine yAxisId="cal" y={1450} stroke="#F59E0B" strokeDasharray="4 2" label={{ value: 'Cal target', position: 'right', fontSize: 10, fill: '#F59E0B' }} />
                  <Bar yAxisId="cal" dataKey="calories" fill="#0E0E55" name="Calories" radius={[3, 3, 0, 0]} />
                  <Bar yAxisId="prot" dataKey="protein" fill="#3CAE63" name="Protein (g)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {chartView === 'workouts' && (
          <div>
            <h2 className="card-title">Workouts Per Week</h2>
            {workoutData.length === 0 ? (
              <p className="empty-state">No workouts logged yet. Get moving! 💪</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={workoutData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <ReferenceLine y={4} stroke="#3CAE63" strokeDasharray="4 2" label={{ value: 'Target 4/wk', position: 'right', fontSize: 10, fill: '#3CAE63' }} />
                  <Bar dataKey="workouts" fill="#0E0E55" name="Workouts" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>

      <div className="two-col-grid">
        <div className="card">
          <h2 className="card-title">❤️ Loved Meals</h2>
          {likedMeals.length === 0 ? (
            <p className="empty-state-small">No liked meals yet — browse meals and react!</p>
          ) : (
            <ul className="feedback-meal-list">
              {likedMeals.map((m, i) => (
                <li key={i} className="feedback-meal-item">
                  <span>{m.name}</span>
                  {m.rating > 0 && <span className="feedback-stars">{'⭐'.repeat(m.rating)}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="card-title">👎 Skip List</h2>
          {dislikedMeals.length === 0 ? (
            <p className="empty-state-small">Nothing disliked yet!</p>
          ) : (
            <ul className="feedback-meal-list">
              {dislikedMeals.map((name, i) => (
                <li key={i} className="feedback-meal-item disliked">{name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {topRated.length > 0 && (
        <div className="card">
          <h2 className="card-title">⭐ Top Rated Meals</h2>
          <div className="top-rated-list">
            {topRated.map((m, i) => (
              <div key={i} className="top-rated-item">
                <span className="top-rated-rank">#{i + 1}</span>
                <span className="top-rated-name">{m.name}</span>
                <span className="top-rated-stars">{'⭐'.repeat(m.rating)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">📋 Activity Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-value">{state.weightLogs.length}</div>
            <div className="summary-label">Weight entries</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{state.workoutLogs.length}</div>
            <div className="summary-label">Workouts logged</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{state.nutritionLogs.length}</div>
            <div className="summary-label">Nutrition days</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{state.measurementLogs.length}</div>
            <div className="summary-label">Measurement entries</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{Object.keys(state.mealFeedback).length}</div>
            <div className="summary-label">Meals rated</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">Wk {currentWeek}</div>
            <div className="summary-label">Current week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;

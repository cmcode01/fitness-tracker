import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exercises, workoutDays, phaseInfo } from '../data/workouts';
import { WorkoutPhase } from '../types';
import { DAY_SHORT, todayStr } from '../utils/calculations';

type WorkoutDay = typeof workoutDays[0];
type Exercise = typeof exercises[0];

const typeIcon = (type: string) => ({ upper: '💪', lower: '🦵', cardio: '🚴', full_body: '⚡', yoga: '🧘', rest: '😴' })[type] ?? '🏋️';
const difficultyLabel = (d: 1 | 2 | 3) => ['Beginner', 'Intermediate', 'Advanced'][d - 1];
const difficultyColor = (d: 1 | 2 | 3) => ['#10B981', '#F59E0B', '#EF4444'][d - 1];

const WorkoutPlan: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedPhase, setSelectedPhase] = useState<WorkoutPhase>(state.currentPhase);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [logForm, setLogForm] = useState<{ duration: number; mood: 'great' | 'good' | 'okay' | 'hard'; notes: string }>({ duration: 45, mood: 'good', notes: '' });

  const phaseWorkouts = workoutDays.filter(w => w.phase === selectedPhase);
  const todayDow = new Date().getDay();
  const pI = phaseInfo[selectedPhase];

  const getExercise = (id: string) => exercises.find(e => e.id === id);

  const handleLogWorkout = () => {
    if (!selectedDay) return;
    dispatch({
      type: 'ADD_WORKOUT_LOG',
      payload: {
        date: todayStr(),
        workoutName: selectedDay.name,
        phase: selectedPhase,
        duration: logForm.duration,
        completedExercises: selectedDay.exerciseIds,
        mood: logForm.mood,
        notes: logForm.notes,
      }
    });
    setLogOpen(false);
    alert('Workout logged! Great work! 🎉');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>💪 Workout Plan</h1>
        <p className="subtitle">Your ACL-safe, progressive training program</p>
      </div>

      <div className="phase-tabs">
        {([1, 2, 3, 4] as WorkoutPhase[]).map(p => (
          <button key={p} className={`phase-tab ${selectedPhase === p ? 'active' : ''}`}
            style={selectedPhase === p ? { borderColor: phaseInfo[p].color, color: phaseInfo[p].color } : {}}
            onClick={() => { setSelectedPhase(p); setSelectedDay(null); }}>
            Phase {p}
            <span className="phase-tab-name">{phaseInfo[p].name}</span>
          </button>
        ))}
      </div>

      <div className="card phase-info-card" style={{ borderLeft: `4px solid ${pI.color}` }}>
        <div className="phase-info-row">
          <div>
            <h3 className="phase-info-name">Phase {selectedPhase}: {pI.name}</h3>
            <p className="phase-info-weeks">Weeks {pI.weeks}</p>
            <p className="phase-info-focus">{pI.focus}</p>
          </div>
          <div className="phase-info-intensity" style={{ color: pI.color }}>
            <div className="intensity-label">Intensity</div>
            <div className="intensity-value">{pI.intensity}</div>
          </div>
        </div>
        {selectedPhase === state.currentPhase && <div className="current-phase-badge">✅ Your current phase</div>}
      </div>

      <div className="card">
        <h2 className="card-title">Weekly Schedule</h2>
        <div className="weekly-schedule">
          {[1, 2, 3, 4, 5, 6, 0].map(dow => {
            const workout = phaseWorkouts.find(w => w.dayOfWeek === dow);
            const isToday = dow === todayDow;
            return (
              <button key={dow}
                className={`day-card ${isToday ? 'today' : ''} ${selectedDay?.id === workout?.id ? 'selected' : ''} ${workout?.type === 'rest' ? 'rest-day' : ''}`}
                onClick={() => setSelectedDay(selectedDay?.id === workout?.id ? null : (workout ?? null))}>
                <div className="day-name">{DAY_SHORT[dow]}</div>
                {workout ? (
                  <>
                    <div className="day-type-icon">{typeIcon(workout.type)}</div>
                    <div className="day-workout-name">{workout.name.split(' ').slice(0, 2).join(' ')}</div>
                    <div className="day-duration">{workout.duration.split(' ')[0]}</div>
                  </>
                ) : <div className="day-no-workout">–</div>}
                {isToday && <div className="today-dot" />}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="card workout-detail">
          <div className="workout-detail-header">
            <div>
              <span className="workout-type-chip">{typeIcon(selectedDay.type)} {selectedDay.type.replace('_', ' ')}</span>
              <h2 className="workout-detail-name">{selectedDay.name}</h2>
              <p className="workout-detail-desc">{selectedDay.description}</p>
              <p className="workout-detail-duration">⏱ {selectedDay.duration}</p>
              {selectedDay.cardioNotes && <div className="cardio-note">📋 {selectedDay.cardioNotes}</div>}
            </div>
            <button className="btn-primary" onClick={() => setLogOpen(true)}>Log This Workout</button>
          </div>

          {selectedDay.exerciseIds.length > 0 && (
            <div className="exercises-list">
              <h3 className="exercises-list-title">Exercises</h3>
              {selectedDay.exerciseIds.map(id => {
                const ex = getExercise(id);
                if (!ex) return null;
                return (
                  <button key={id}
                    className={`exercise-item ${selectedExercise?.id === id ? 'expanded' : ''}`}
                    onClick={() => setSelectedExercise(selectedExercise?.id === id ? null : ex)}>
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
                      <span className="difficulty-badge" style={{ background: difficultyColor(ex.difficulty) }}>
                        {difficultyLabel(ex.difficulty)}
                      </span>
                    </div>
                    {selectedExercise?.id === id && (
                      <div className="exercise-detail">
                        <div className="exercise-section"><strong>How to do it:</strong><p>{ex.instructions}</p></div>
                        <div className="exercise-section acl-note"><strong>🦵 ACL Modification:</strong><p>{ex.aclModification}</p></div>
                        <div className="exercise-section"><strong>Equipment:</strong> {ex.equipment.join(', ')}</div>
                        <div className="exercise-section"><strong>Target muscles:</strong> {ex.targetMuscles.join(', ')}</div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {logOpen && selectedDay && (
        <div className="modal-overlay" onClick={() => setLogOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Log Workout</h2>
            <p className="modal-subtitle">{selectedDay.name}</p>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input type="number" value={logForm.duration} onChange={e => setLogForm(p => ({ ...p, duration: +e.target.value }))} className="form-input" min={5} max={180} />
            </div>
            <div className="form-group">
              <label>How did it feel?</label>
              <div className="mood-buttons">
                {(['great', 'good', 'okay', 'hard'] as const).map(m => (
                  <button key={m} className={`mood-btn ${logForm.mood === m ? 'selected' : ''}`}
                    onClick={() => setLogForm(p => ({ ...p, mood: m }))}>
                    {m === 'great' ? '🤩' : m === 'good' ? '😊' : m === 'okay' ? '😐' : '😓'} {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea value={logForm.notes} onChange={e => setLogForm(p => ({ ...p, notes: e.target.value }))} className="form-input form-textarea" placeholder="How was the workout? Any modifications?" />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setLogOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleLogWorkout}>Save Log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;

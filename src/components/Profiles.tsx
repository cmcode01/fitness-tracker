import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityLevel, FitnessGoal, WorkoutPhase } from '../types';
import { todayStr, calculateCurrentPhase, USER_PROFILE, GOAL_LABELS, ACTIVITY_LABELS } from '../utils/calculations';

const AVATAR_OPTIONS = ['🏃', '💪', '🌿', '⚡', '🌸', '🔥', '🏋️', '🧘', '🚴', '🏊'];
const RESTRICTION_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Allium-free',
  'Nut-free', 'Low-carb', 'Keto', 'Halal', 'Kosher',
];

const Profiles: React.FC = () => {
  const { state, dispatch, activeProfile } = useApp();
  const { saveOuraToken, syncOura } = useApp();

  const [form, setForm] = useState({
    name: '',
    avatarEmoji: '🏃',
    age: '',
    heightFeet: '',
    heightInches: '',
    startWeight: '',
    goalWeight: '',
    dietaryRestrictions: [] as string[],
    startDate: todayStr(),
    fitnessGoal: 'weight_loss' as FitnessGoal,
    activityLevel: 'moderately_active' as ActivityLevel,
  });
  const [saved, setSaved] = useState(false);

  const [showOura, setShowOura] = useState(false);
  const [ouraInput, setOuraInput] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  useEffect(() => {
    if (!activeProfile) return;
    setForm({
      name: activeProfile.name,
      avatarEmoji: activeProfile.avatarEmoji,
      age: String(activeProfile.age),
      heightFeet: String(Math.floor(activeProfile.heightInches / 12)),
      heightInches: String(activeProfile.heightInches % 12),
      startWeight: String(activeProfile.startWeight),
      goalWeight: String(activeProfile.goalWeight),
      dietaryRestrictions: [...activeProfile.dietaryRestrictions],
      startDate: activeProfile.startDate,
      fitnessGoal: activeProfile.fitnessGoal ?? 'weight_loss',
      activityLevel: activeProfile.activityLevel ?? 'moderately_active',
    });
  }, [activeProfile?.profileId]);

  const toggleRestriction = (r: string) =>
    setForm(p => ({
      ...p,
      dietaryRestrictions: p.dietaryRestrictions.includes(r)
        ? p.dietaryRestrictions.filter(x => x !== r)
        : [...p.dietaryRestrictions, r],
    }));

  const handleSave = () => {
    if (!form.name.trim() || !activeProfile) { alert('Please enter your name.'); return; }
    const heightInches = (parseFloat(form.heightFeet || '0') * 12) + parseFloat(form.heightInches || '0');
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        ...activeProfile,
        name: form.name.trim(),
        avatarEmoji: form.avatarEmoji,
        age: parseFloat(form.age) || activeProfile.age,
        heightInches: heightInches || activeProfile.heightInches,
        startWeight: parseFloat(form.startWeight) || activeProfile.startWeight,
        goalWeight: parseFloat(form.goalWeight) || activeProfile.goalWeight,
        dietaryRestrictions: form.dietaryRestrictions,
        startDate: form.startDate || activeProfile.startDate,
        currentPhase: calculateCurrentPhase(form.startDate || activeProfile.startDate) as WorkoutPhase,
        fitnessGoal: form.fitnessGoal,
        activityLevel: form.activityLevel,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveOura = async () => {
    if (!ouraInput.trim()) return;
    await saveOuraToken(ouraInput.trim());
    setOuraInput('');
    setShowOura(false);
  };

  const handleSyncOura = async () => {
    setSyncing(true);
    setSyncResult(null);
    const ok = await syncOura();
    setSyncing(false);
    setSyncResult(ok ? 'Oura data synced for today!' : 'Sync failed. Check your token or try again.');
  };

  if (!activeProfile) return null;

  const lbs = activeProfile.startWeight - activeProfile.goalWeight;

  return (
    <div className="page">
      <div className="page-header">
        <h1>⚙️ My Profile</h1>
        <p className="subtitle">Your personal settings, goals, and connected devices</p>
      </div>

      <div className="card">
        <h2 className="card-title">Profile Settings</h2>

        <div className="form-group">
          <label>Avatar</label>
          <div className="avatar-picker">
            {AVATAR_OPTIONS.map(a => (
              <button
                key={a}
                className={`avatar-option ${form.avatarEmoji === a ? 'selected' : ''}`}
                onClick={() => setForm(p => ({ ...p, avatarEmoji: a }))}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Name *</label>
            <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input className="form-input" type="number" min={10} max={100} value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} placeholder="e.g. 30" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Height (ft)</label>
            <input className="form-input" type="number" min={3} max={8} value={form.heightFeet} onChange={e => setForm(p => ({ ...p, heightFeet: e.target.value }))} placeholder="5" />
          </div>
          <div className="form-group">
            <label>Height (in)</label>
            <input className="form-input" type="number" min={0} max={11} value={form.heightInches} onChange={e => setForm(p => ({ ...p, heightInches: e.target.value }))} placeholder="4" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Starting Weight (lbs)</label>
            <input className="form-input" type="number" step="0.1" value={form.startWeight} onChange={e => setForm(p => ({ ...p, startWeight: e.target.value }))} placeholder="e.g. 191" />
          </div>
          <div className="form-group">
            <label>Goal Weight (lbs)</label>
            <input className="form-input" type="number" step="0.1" value={form.goalWeight} onChange={e => setForm(p => ({ ...p, goalWeight: e.target.value }))} placeholder="e.g. 141" />
          </div>
        </div>

        <div className="form-group">
          <label>Program Start Date</label>
          <input className="form-input" type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
        </div>

        <div className="form-group">
          <label>Fitness Goal</label>
          <div className="restriction-chips">
            {(Object.keys(GOAL_LABELS) as FitnessGoal[]).map(g => (
              <button
                key={g}
                className={`chip ${form.fitnessGoal === g ? 'active' : ''}`}
                onClick={() => setForm(p => ({ ...p, fitnessGoal: g }))}
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Activity Level</label>
          <div className="restriction-chips">
            {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map(a => (
              <button
                key={a}
                className={`chip ${form.activityLevel === a ? 'active' : ''}`}
                onClick={() => setForm(p => ({ ...p, activityLevel: a }))}
              >
                {ACTIVITY_LABELS[a]}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Dietary Restrictions</label>
          <div className="restriction-chips">
            {RESTRICTION_OPTIONS.map(r => (
              <button
                key={r}
                className={`chip ${form.dietaryRestrictions.includes(r) ? 'active' : ''}`}
                onClick={() => toggleRestriction(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="lwi-actions">
          <button className="btn-primary" onClick={handleSave}>
            {saved ? 'Saved ✓' : 'Save Profile'}
          </button>
        </div>

        {lbs > 0 && (
          <p className="form-note" style={{ marginTop: '0.75rem' }}>
            Goal: lose {lbs} lbs · Phase {activeProfile.currentPhase} · Started {activeProfile.startDate}
          </p>
        )}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header-row">
          <h2 className="card-title">Oura Ring</h2>
          {state.ouraToken && <span className="logged-badge">Connected</span>}
        </div>
        <p className="form-note">
          Connect your Oura Ring to automatically import sleep, readiness, and activity data.
          Get your Personal Access Token at{' '}
          <strong>cloud.ouraring.com → Personal Access Tokens</strong>.
        </p>
        {!showOura ? (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => setShowOura(true)}>
              {state.ouraToken ? 'Update Token' : 'Connect Oura'}
            </button>
            {state.ouraToken && (
              <button className="btn-primary" onClick={handleSyncOura} disabled={syncing}>
                {syncing ? 'Syncing…' : 'Sync Today'}
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label>Oura Personal Access Token</label>
              <input
                className="form-input"
                type="password"
                placeholder="Paste your token here…"
                value={ouraInput}
                onChange={e => setOuraInput(e.target.value)}
              />
            </div>
            <div className="lwi-actions">
              <button className="btn-secondary" onClick={() => { setShowOura(false); setOuraInput(''); }}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveOura}>Save Token</button>
            </div>
          </div>
        )}
        {syncResult && (
          <p className="form-note" style={{ marginTop: '0.5rem', color: syncResult.includes('failed') ? '#ef4444' : 'var(--teal)' }}>
            {syncResult}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profiles;

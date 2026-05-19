import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityLevel, FitnessGoal, WorkoutPhase } from '../types';
import { todayStr, calculateCurrentPhase, USER_PROFILE, GOAL_LABELS, ACTIVITY_LABELS } from '../utils/calculations';

const AVATAR_OPTIONS = ['🏃', '💪', '🌿', '⚡', '🌸', '🔥', '🏋️', '🧘', '🚴', '🏊'];

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
    healthConcerns: '',
    startDate: todayStr(),
    fitnessGoal: 'weight_loss' as FitnessGoal,
    activityLevel: 'moderately_active' as ActivityLevel,
  });
  const [saved, setSaved] = useState(false);
  const [newRestriction, setNewRestriction] = useState('');

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
      healthConcerns: activeProfile.healthConcerns ?? '',
      startDate: activeProfile.startDate,
      fitnessGoal: activeProfile.fitnessGoal ?? 'weight_loss',
      activityLevel: activeProfile.activityLevel ?? 'moderately_active',
    });
  }, [activeProfile?.profileId]);

  const addRestriction = () => {
    const val = newRestriction.trim();
    if (val && !form.dietaryRestrictions.map(r => r.toLowerCase()).includes(val.toLowerCase())) {
      setForm(p => ({ ...p, dietaryRestrictions: [...p.dietaryRestrictions, val] }));
    }
    setNewRestriction('');
  };

  const removeRestriction = (r: string) =>
    setForm(p => ({ ...p, dietaryRestrictions: p.dietaryRestrictions.filter(x => x !== r) }));

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
        healthConcerns: form.healthConcerns,
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
          <div className="form-row" style={{ alignItems: 'flex-start' }}>
            <input
              className="form-input"
              value={newRestriction}
              onChange={e => setNewRestriction(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addRestriction(); } }}
              placeholder="e.g. gluten-free, vegan, nut allergy…"
            />
            <button className="btn-secondary" onClick={addRestriction} style={{ whiteSpace: 'nowrap' }}>Add</button>
          </div>
          {form.dietaryRestrictions.length > 0 && (
            <div className="restriction-chips" style={{ marginTop: '0.5rem' }}>
              {form.dietaryRestrictions.map(r => (
                <span key={r} className="chip active" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  {r}
                  <button
                    onClick={() => removeRestriction(r)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.9rem', color: 'inherit' }}
                    aria-label={`Remove ${r}`}
                  >×</button>
                </span>
              ))}
            </div>
          )}
          <p className="form-note" style={{ marginTop: '0.4rem' }}>
            Meals auto-filter for: vegetarian, vegan, gluten-free, dairy-free, nut-free, low-carb, keto, halal.
          </p>
        </div>

        <div className="form-group">
          <label>Health Concerns & Injuries</label>
          <textarea
            className="form-input"
            rows={3}
            value={form.healthConcerns}
            onChange={e => setForm(p => ({ ...p, healthConcerns: e.target.value }))}
            placeholder="e.g. ACL reconstruction (left knee), lower back pain, hypertension…"
            style={{ resize: 'vertical' }}
          />
          <p className="form-note" style={{ marginTop: '0.4rem' }}>
            Shown as a reminder in your workout plan so you can adapt exercises accordingly.
          </p>
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

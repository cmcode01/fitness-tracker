import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Profile, WorkoutPhase } from '../types';
import { todayStr, calculateCurrentPhase, USER_PROFILE } from '../utils/calculations';

const AVATAR_OPTIONS = ['🏃', '💪', '🌿', '⚡', '🌸', '🔥', '🏋️', '🧘', '🚴', '🏊'];
const RESTRICTION_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Allium-free',
  'Nut-free', 'Low-carb', 'Keto', 'Halal', 'Kosher',
];

const emptyForm = {
  name: '',
  avatarEmoji: '🏃',
  age: '',
  heightFeet: '',
  heightInches: '',
  startWeight: '',
  goalWeight: '',
  dietaryRestrictions: [] as string[],
  startDate: todayStr(),
};

type FormState = typeof emptyForm;

const ProfileForm: React.FC<{
  initial?: Partial<FormState>;
  onSave: (f: FormState) => void;
  onCancel: () => void;
  isEdit?: boolean;
}> = ({ initial, onSave, onCancel, isEdit }) => {
  const [form, setForm] = useState<FormState>({ ...emptyForm, ...initial });

  const toggleRestriction = (r: string) =>
    setForm(p => ({
      ...p,
      dietaryRestrictions: p.dietaryRestrictions.includes(r)
        ? p.dietaryRestrictions.filter(x => x !== r)
        : [...p.dietaryRestrictions, r],
    }));

  const handleSave = () => {
    if (!form.name.trim()) { alert('Please enter a profile name.'); return; }
    onSave(form);
  };

  return (
    <div className="profile-form card">
      <h3 className="card-title">{isEdit ? 'Edit Profile' : 'New Profile'}</h3>

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
          <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Mom, Dad, Alex" />
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
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" onClick={handleSave}>{isEdit ? 'Save Changes' : 'Create Profile'}</button>
      </div>
    </div>
  );
};

const Profiles: React.FC = () => {
  const { state, dispatch, activeProfile, switchProfile } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showOura, setShowOura] = useState(false);
  const [ouraInput, setOuraInput] = useState('');
  const { saveOuraToken, syncOura } = useApp();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleCreate = async (form: typeof emptyForm) => {
    const heightInches = (parseFloat(form.heightFeet || '0') * 12) + parseFloat(form.heightInches || '0');
    const startDate = form.startDate || todayStr();
    dispatch({
      type: 'CREATE_PROFILE',
      payload: {
        userId: '',
        name: form.name.trim(),
        avatarEmoji: form.avatarEmoji,
        age: parseFloat(form.age) || USER_PROFILE.age,
        heightInches: heightInches || USER_PROFILE.heightInches,
        startWeight: parseFloat(form.startWeight) || USER_PROFILE.startWeight,
        goalWeight: parseFloat(form.goalWeight) || USER_PROFILE.targetWeight,
        dietaryRestrictions: form.dietaryRestrictions,
        startDate,
        currentPhase: calculateCurrentPhase(startDate) as WorkoutPhase,
        isDefault: state.profiles.length === 0,
      },
    });
    setShowCreate(false);
  };

  const handleEdit = async (profile: Profile, form: typeof emptyForm) => {
    const heightInches = (parseFloat(form.heightFeet || '0') * 12) + parseFloat(form.heightInches || '0');
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        ...profile,
        name: form.name.trim(),
        avatarEmoji: form.avatarEmoji,
        age: parseFloat(form.age) || profile.age,
        heightInches: heightInches || profile.heightInches,
        startWeight: parseFloat(form.startWeight) || profile.startWeight,
        goalWeight: parseFloat(form.goalWeight) || profile.goalWeight,
        dietaryRestrictions: form.dietaryRestrictions,
        startDate: form.startDate || profile.startDate,
        currentPhase: calculateCurrentPhase(form.startDate || profile.startDate) as WorkoutPhase,
      },
    });
    setEditingId(null);
  };

  const handleDelete = (profile: Profile) => {
    if (profile.isDefault) { alert('Cannot delete the default profile.'); return; }
    if (!confirm(`Delete profile "${profile.name}"? All their data will be permanently removed.`)) return;
    dispatch({ type: 'DELETE_PROFILE', payload: profile.profileId });
  };

  const profileToForm = (p: Profile): Partial<typeof emptyForm> => ({
    name: p.name,
    avatarEmoji: p.avatarEmoji,
    age: String(p.age),
    heightFeet: String(Math.floor(p.heightInches / 12)),
    heightInches: String(p.heightInches % 12),
    startWeight: String(p.startWeight),
    goalWeight: String(p.goalWeight),
    dietaryRestrictions: [...p.dietaryRestrictions],
    startDate: p.startDate,
  });

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
    setSyncResult(ok ? "Oura data synced for today!" : "Sync failed. Check your token or try again.");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>👤 Profiles</h1>
        <p className="subtitle">Manage household member profiles — each with their own goals and data</p>
      </div>

      {/* Profile cards */}
      <div className="profiles-grid">
        {state.profiles.map(profile => {
          const isActive = profile.profileId === state.activeProfileId;
          const editing = editingId === profile.profileId;
          const lbs = profile.startWeight - profile.goalWeight;

          if (editing) {
            return (
              <ProfileForm
                key={profile.profileId}
                initial={profileToForm(profile)}
                onSave={form => handleEdit(profile, form)}
                onCancel={() => setEditingId(null)}
                isEdit
              />
            );
          }

          return (
            <div key={profile.profileId} className={`profile-card card ${isActive ? 'profile-active' : ''}`}>
              <div className="profile-card-top">
                <div className="profile-avatar">{profile.avatarEmoji}</div>
                <div className="profile-info">
                  <div className="profile-name">
                    {profile.name}
                    {isActive && <span className="active-badge">Active</span>}
                  </div>
                  <div className="profile-meta">
                    {profile.age}y · {Math.floor(profile.heightInches / 12)}′{profile.heightInches % 12}″ · Goal: −{lbs} lbs
                  </div>
                  {profile.dietaryRestrictions.length > 0 && (
                    <div className="profile-restrictions">
                      {profile.dietaryRestrictions.map(r => <span key={r} className="chip small">{r}</span>)}
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-card-actions">
                {!isActive && (
                  <button className="btn-primary btn-sm" onClick={() => switchProfile(profile.profileId)}>
                    Switch to {profile.name}
                  </button>
                )}
                <button className="btn-secondary btn-sm" onClick={() => setEditingId(profile.profileId)}>Edit</button>
                {!profile.isDefault && (
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(profile)}>Delete</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreate ? (
        <ProfileForm onSave={handleCreate} onCancel={() => setShowCreate(false)} />
      ) : (
        <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Add Profile</button>
      )}

      {/* Oura Ring settings */}
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

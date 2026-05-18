import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message);
      } else {
        setMessage('Check your email for a confirmation link, then sign in.');
        setMode('signin');
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🌿</div>
          <h1 className="auth-title">FitLife</h1>
          <p className="auth-subtitle">Your personal fitness & nutrition tracker</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => { setMode('signin'); setError(''); setMessage(''); }}>
            Sign In
          </button>
          <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(''); setMessage(''); }}>
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-features">
          Track workouts · Log nutrition · Monitor progress · All your data synced across devices
        </p>
      </div>
    </div>
  );
};

export default Auth;

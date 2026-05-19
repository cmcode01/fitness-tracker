import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'workouts', label: 'Workouts', icon: '💪' },
  { id: 'meals', label: 'Meals', icon: '🥗' },
  { id: 'journal', label: 'Journal', icon: '📓' },
  { id: 'progress', label: 'Progress', icon: '📊' },
  { id: 'profiles', label: 'Profiles', icon: '👤' },
];

const Navigation: React.FC<Props> = ({ activeTab, setActiveTab, onSignOut }) => {
  const { state, switchProfile, activeProfile } = useApp();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <nav className="top-nav">
        <div className="nav-brand">
          <span className="nav-logo">🌿</span>
          <span className="nav-title">FitLife</span>
        </div>
        <div className="nav-links">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Profile quick-switcher */}
        {state.profiles.length > 0 && (
          <div className="profile-switcher-wrap" ref={menuRef}>
            <button
              className="profile-switcher-btn"
              onClick={() => setProfileMenuOpen(p => !p)}
              title="Switch profile"
            >
              <span className="profile-switcher-avatar">{activeProfile?.avatarEmoji ?? '👤'}</span>
              <span className="profile-switcher-name">{activeProfile?.name ?? 'Profile'}</span>
              <span className="profile-switcher-caret">▾</span>
            </button>
            {profileMenuOpen && (
              <div className="profile-dropdown">
                {state.profiles.map(p => (
                  <button
                    key={p.profileId}
                    className={`profile-dropdown-item ${p.profileId === state.activeProfileId ? 'active' : ''}`}
                    onClick={() => { switchProfile(p.profileId); setProfileMenuOpen(false); }}
                  >
                    <span>{p.avatarEmoji}</span>
                    <span>{p.name}</span>
                    {p.profileId === state.activeProfileId && <span className="check">✓</span>}
                  </button>
                ))}
                <button
                  className="profile-dropdown-item manage"
                  onClick={() => { setActiveTab('profiles'); setProfileMenuOpen(false); }}
                >
                  ⚙️ Manage Profiles
                </button>
              </div>
            )}
          </div>
        )}

        <button className="nav-signout" onClick={onSignOut} title="Sign out">
          Sign out
        </button>
      </nav>
      <nav className="bottom-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`bottom-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navigation;

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
  { id: 'profiles', label: 'Settings', icon: '⚙️' },
];

const Navigation: React.FC<Props> = ({ activeTab, setActiveTab, onSignOut }) => {
  const { activeProfile } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <nav className="top-nav">
        <div className="nav-brand">
          <span className="nav-logo">🧬</span>
          <span className="nav-title">BioMe</span>
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

        {/* Account menu */}
        <div className="profile-switcher-wrap" ref={menuRef}>
          <button
            className="profile-switcher-btn"
            onClick={() => setMenuOpen(p => !p)}
            title="Account"
          >
            <span className="profile-switcher-avatar">{activeProfile?.avatarEmoji ?? '👤'}</span>
            <span className="profile-switcher-name">{activeProfile?.name ?? 'Account'}</span>
            <span className="profile-switcher-caret">▾</span>
          </button>
          {menuOpen && (
            <div className="profile-dropdown">
              <button
                className="profile-dropdown-item"
                onClick={() => { setActiveTab('profiles'); setMenuOpen(false); }}
              >
                ⚙️ My Profile
              </button>
              <button
                className="profile-dropdown-item"
                onClick={() => { setMenuOpen(false); onSignOut(); }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
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

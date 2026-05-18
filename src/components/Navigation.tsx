import React from 'react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'workouts', label: 'Workouts', icon: '💪' },
  { id: 'meals', label: 'Meals', icon: '🥗' },
  { id: 'journal', label: 'Journal', icon: '📓' },
  { id: 'progress', label: 'Progress', icon: '📊' },
];

const Navigation: React.FC<Props> = ({ activeTab, setActiveTab }) => (
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

export default Navigation;

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import WorkoutPlan from './components/WorkoutPlan';
import MealPlan from './components/MealPlan';
import Journal from './components/Journal';
import Progress from './components/Progress';
import Auth from './components/Auth';

type Tab = 'dashboard' | 'workouts' | 'meals' | 'journal' | 'progress';

const AppInner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { user, loading, signOut } = useApp();
  const handleTabChange = (tab: string) => setActiveTab(tab as Tab);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading your data…</p>
      </div>
    );
  }

  if (!user) return <Auth />;

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={handleTabChange} />;
      case 'workouts': return <WorkoutPlan />;
      case 'meals': return <MealPlan />;
      case 'journal': return <Journal />;
      case 'progress': return <Progress />;
    }
  };

  return (
    <div className="app">
      <Navigation activeTab={activeTab} setActiveTab={handleTabChange} onSignOut={signOut} />
      <main className="main-content">
        {renderTab()}
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppInner />
  </AppProvider>
);

export default App;

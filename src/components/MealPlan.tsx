import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { meals, getWeeklyMealPlan, mealMatchesRestrictions } from '../data/meals';
import { Meal, MealType } from '../types';
import { calculateCurrentWeek, DAY_SHORT, todayStr } from '../utils/calculations';

const CUISINE_EMOJI: Record<string, string> = {
  mexican: '🌮', italian: '🍝', indian: '🍛', mediterranean: '🫙',
  asian: '🥢', american: '🥗', moroccan: '🫕', greek: '🫒',
};

const MealPlan: React.FC = () => {
  const { state, dispatch, activeProfile } = useApp();
  const [activeView, setActiveView] = useState<'week' | 'browse' | 'recommended'>('week');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [filterType, setFilterType] = useState<MealType | 'all'>('all');
  const [filterCuisine, setFilterCuisine] = useState<string>('all');
  const [portionSize, setPortionSize] = useState(1.0);
  const [hideDisliked, setHideDisliked] = useState(false);

  const restrictions = activeProfile?.dietaryRestrictions ?? [];
  const weekNumber = calculateCurrentWeek(state.startDate) - 1;
  const weekPlan = getWeeklyMealPlan(weekNumber, restrictions);
  const todayDow = new Date().getDay();

  const feedbackFor = (id: string) => state.mealFeedback[id];

  const setFeedback = (meal: Meal, reaction: 'liked' | 'disliked') =>
    dispatch({ type: 'SET_MEAL_FEEDBACK', payload: { mealId: meal.id, reaction, rating: feedbackFor(meal.id)?.rating ?? 0 } });

  const setRating = (meal: Meal, rating: number) =>
    dispatch({ type: 'SET_MEAL_FEEDBACK', payload: { mealId: meal.id, reaction: feedbackFor(meal.id)?.reaction ?? null, rating } });

  const logMealNow = (meal: Meal) => {
    const today = todayStr();
    const existing = state.nutritionLogs.find(n => n.date === today);
    const newMeal = {
      mealId: meal.id, mealName: meal.name, portionMultiplier: portionSize,
      calories: Math.round(meal.caloriesPerServing * portionSize),
      protein: Math.round(meal.proteinPerServing * portionSize),
    };
    const mealsLogged = existing ? [...existing.meals, newMeal] : [newMeal];
    dispatch({
      type: 'ADD_NUTRITION_LOG',
      payload: {
        date: today, meals: mealsLogged, waterIntake: existing?.waterIntake ?? 0,
        totalCalories: mealsLogged.reduce((s, m) => s + m.calories, 0),
        totalProtein: mealsLogged.reduce((s, m) => s + m.protein, 0),
      }
    });
    setSelectedMeal(null);
    alert(`Logged: ${newMeal.calories} cal, ${newMeal.protein}g protein 🎉`);
  };

  // Sort meals by feedback: liked first, neutral middle, disliked last
  const mealScore = (meal: Meal): number => {
    const fb = feedbackFor(meal.id);
    if (!fb || fb.reaction === null) return 0;
    if (fb.reaction === 'liked') return 1 + (fb.rating / 10);
    return -1;
  };

  const compliantMeals = meals.filter(m => mealMatchesRestrictions(m, restrictions));
  const hiddenByRestrictions = meals.length - compliantMeals.length;

  const baseMeals = compliantMeals.filter(m =>
    (filterType === 'all' || m.type === filterType) &&
    (filterCuisine === 'all' || m.cuisine === filterCuisine)
  );

  const filteredMeals = (hideDisliked
    ? baseMeals.filter(m => feedbackFor(m.id)?.reaction !== 'disliked')
    : baseMeals
  ).slice().sort((a, b) => mealScore(b) - mealScore(a));

  const likedMeals = compliantMeals.filter(m => feedbackFor(m.id)?.reaction === 'liked')
    .sort((a, b) => (feedbackFor(b.id)?.rating ?? 0) - (feedbackFor(a.id)?.rating ?? 0));

  const dislikedCount = compliantMeals.filter(m => feedbackFor(m.id)?.reaction === 'disliked').length;

  const cuisines = Array.from(new Set(compliantMeals.map(m => m.cuisine)));

  return (
    <div className="page">
      <div className="page-header">
        <h1>🥗 Meal Plan</h1>
        <p className="subtitle">Meals filtered for your dietary preferences</p>
      </div>

      {restrictions.length > 0 && (
        <div className="restriction-banner">
          <span className="restriction-banner-icon">🔍</span>
          <span>
            Showing meals for: <strong>{restrictions.join(', ')}</strong>
            {hiddenByRestrictions > 0 && ` · ${hiddenByRestrictions} meal${hiddenByRestrictions > 1 ? 's' : ''} hidden`}
          </span>
        </div>
      )}

      <div className="view-toggle">
        <button className={`toggle-btn ${activeView === 'week' ? 'active' : ''}`} onClick={() => setActiveView('week')}>📅 This Week</button>
        <button className={`toggle-btn ${activeView === 'recommended' ? 'active' : ''}`} onClick={() => setActiveView('recommended')}>
          ❤️ For You {likedMeals.length > 0 ? `(${likedMeals.length})` : ''}
        </button>
        <button className={`toggle-btn ${activeView === 'browse' ? 'active' : ''}`} onClick={() => setActiveView('browse')}>🔍 Browse All</button>
      </div>

      {activeView === 'week' && (
        <>
          <div className="card">
            <h2 className="card-title">Week {calculateCurrentWeek(state.startDate)} Plan</h2>
            <div className="week-plan-grid">
              {weekPlan.map(({ day, breakfast, lunch, dinner, snack }) => (
                <div key={day} className={`week-day-col ${day === todayDow ? 'today-col' : ''}`}>
                  <div className="week-day-header">
                    {DAY_SHORT[day]}
                    {day === todayDow && <span className="today-tag">Today</span>}
                  </div>
                  {[breakfast, lunch, dinner, snack].map((meal, i) =>
                    meal && (
                      <button key={i} className="week-meal-cell" onClick={() => { setSelectedMeal(meal); setPortionSize(1.0); }}>
                        <div className="week-meal-type">{['🌅', '☀️', '🌙', '🍎'][i]}</div>
                        <div className="week-meal-name">{meal.name}</div>
                        <div className="week-meal-cal">{meal.caloriesPerServing}cal</div>
                        {feedbackFor(meal.id)?.reaction === 'liked' && <div style={{ fontSize: '0.6rem' }}>❤️</div>}
                        {feedbackFor(meal.id)?.reaction === 'disliked' && <div style={{ fontSize: '0.6rem' }}>👎</div>}
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="card nutrition-legend">
            <h3 className="card-title">Daily Targets</h3>
            <div className="legend-grid">
              <div className="legend-item"><span>🔥 Calories</span><strong>1,400–1,500</strong></div>
              <div className="legend-item"><span>💪 Protein</span><strong>100–130g</strong></div>
              <div className="legend-item"><span>💧 Water</span><strong>8 glasses</strong></div>
              <div className="legend-item"><span>🥦 Fiber</span><strong>25–30g</strong></div>
            </div>
          </div>
        </>
      )}

      {activeView === 'recommended' && (
        <div>
          {likedMeals.length === 0 ? (
            <div className="card">
              <p className="empty-state">No favorites yet — browse meals and tap ❤️ Love it to build your list!</p>
            </div>
          ) : (
            <>
              <div className="card">
                <h2 className="card-title">Your Favorites ({likedMeals.length})</h2>
                <p className="form-note">Meals you've liked, sorted by rating. Tap to see details or log.</p>
                <div className="meals-grid">
                  {likedMeals.map(meal => {
                    const fb = feedbackFor(meal.id);
                    return (
                      <button key={meal.id} className="meal-card liked-meal-card" onClick={() => { setSelectedMeal(meal); setPortionSize(1.0); }}>
                        <div className="meal-card-header">
                          <span className="cuisine-emoji">{CUISINE_EMOJI[meal.cuisine] ?? '🍽️'}</span>
                          <span className="meal-type-badge">{meal.type}</span>
                          <span className="fb-icon">❤️</span>
                        </div>
                        <h3 className="meal-card-name">{meal.name}</h3>
                        <div className="meal-card-meta">
                          <span>🔥 {meal.caloriesPerServing} cal</span>
                          <span>💪 {meal.proteinPerServing}g protein</span>
                          <span>⏱ {meal.prepTime} min</span>
                        </div>
                        {fb?.rating ? <div className="meal-rating-display">{'⭐'.repeat(fb.rating)}</div> : null}
                        {meal.weekdayFriendly && <div className="weekday-badge">Quick weekday</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
              {dislikedCount > 0 && (
                <div className="card">
                  <p className="form-note">You've marked {dislikedCount} meal{dislikedCount > 1 ? 's' : ''} as disliked — these are hidden from your recommendations and deprioritized in Browse.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeView === 'browse' && (
        <>
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Meal Type</label>
              <div className="filter-chips">
                {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map(t => (
                  <button key={t} className={`chip ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
                    {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">Cuisine</label>
              <div className="filter-chips">
                <button className={`chip ${filterCuisine === 'all' ? 'active' : ''}`} onClick={() => setFilterCuisine('all')}>All</button>
                {cuisines.map(c => (
                  <button key={c} className={`chip ${filterCuisine === c ? 'active' : ''}`} onClick={() => setFilterCuisine(c)}>
                    {CUISINE_EMOJI[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {dislikedCount > 0 && (
              <div className="filter-group">
                <label className="filter-label">Preferences</label>
                <div className="filter-chips">
                  <button className={`chip ${hideDisliked ? 'active' : ''}`} onClick={() => setHideDisliked(p => !p)}>
                    Hide 👎 ({dislikedCount})
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="meals-count">{filteredMeals.length} meals{hideDisliked && dislikedCount > 0 ? ` (${dislikedCount} hidden)` : ''} · sorted by your preferences</div>
          <div className="meals-grid">
            {filteredMeals.map(meal => {
              const fb = feedbackFor(meal.id);
              return (
                <button key={meal.id} className={`meal-card ${fb?.reaction === 'disliked' ? 'meal-card-disliked' : ''}`} onClick={() => { setSelectedMeal(meal); setPortionSize(1.0); }}>
                  <div className="meal-card-header">
                    <span className="cuisine-emoji">{CUISINE_EMOJI[meal.cuisine] ?? '🍽️'}</span>
                    <span className="meal-type-badge">{meal.type}</span>
                    {fb?.reaction === 'liked' && <span className="fb-icon">❤️</span>}
                    {fb?.reaction === 'disliked' && <span className="fb-icon">👎</span>}
                  </div>
                  <h3 className="meal-card-name">{meal.name}</h3>
                  <div className="meal-card-meta">
                    <span>🔥 {meal.caloriesPerServing} cal</span>
                    <span>💪 {meal.proteinPerServing}g protein</span>
                    <span>⏱ {meal.prepTime} min</span>
                  </div>
                  {fb?.rating ? <div className="meal-rating-display">{'⭐'.repeat(fb.rating)}</div> : null}
                  {meal.weekdayFriendly && <div className="weekday-badge">Quick weekday</div>}
                </button>
              );
            })}
          </div>
        </>
      )}

      {selectedMeal && (
        <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMeal(null)}>✕</button>
            <div className="meal-modal-header">
              <span className="cuisine-emoji-lg">{CUISINE_EMOJI[selectedMeal.cuisine] ?? '🍽️'}</span>
              <div>
                <h2 className="modal-title">{selectedMeal.name}</h2>
                <div className="meal-modal-tags">
                  <span className="tag">{selectedMeal.cuisine}</span>
                  <span className="tag">{selectedMeal.type}</span>
                  <span className="tag">⏱ {selectedMeal.prepTime} min</span>
                  {selectedMeal.weekdayFriendly && <span className="tag green">Quick weekday</span>}
                </div>
              </div>
            </div>

            <div className="portion-section">
              <div className="portion-header">
                <h3>Nutrition ({selectedMeal.servingSize})</h3>
                <div className="portion-controls">
                  <label>Portion: </label>
                  <div className="portion-buttons">
                    {[0.5, 1.0, 1.5, 2.0].map(p => (
                      <button key={p} className={`portion-btn ${portionSize === p ? 'active' : ''}`} onClick={() => setPortionSize(p)}>{p}x</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="macros-row">
                {[
                  { v: Math.round(selectedMeal.caloriesPerServing * portionSize), l: 'calories' },
                  { v: Math.round(selectedMeal.proteinPerServing * portionSize), l: 'protein', u: 'g' },
                  { v: Math.round(selectedMeal.carbsPerServing * portionSize), l: 'carbs', u: 'g' },
                  { v: Math.round(selectedMeal.fatPerServing * portionSize), l: 'fat', u: 'g' },
                ].map(({ v, l, u }) => (
                  <div key={l} className="macro-pill"><strong>{v}{u ?? ''}</strong><span>{l}</span></div>
                ))}
              </div>
            </div>

            <div className="recipe-section">
              <h3>Ingredients</h3>
              <ul className="ingredients-list">{selectedMeal.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
            </div>
            <div className="recipe-section">
              <h3>Instructions</h3>
              <ol className="instructions-list">{selectedMeal.instructions.map((step, i) => <li key={i}>{step}</li>)}</ol>
            </div>
            <div className="recipe-section">
              <div className="tags-row">{selectedMeal.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
            </div>

            <div className="feedback-section">
              <h3>Rate This Meal</h3>
              <div className="feedback-row">
                <div className="reaction-buttons">
                  <button className={`reaction-btn ${feedbackFor(selectedMeal.id)?.reaction === 'liked' ? 'active-liked' : ''}`}
                    onClick={() => setFeedback(selectedMeal, 'liked')}>❤️ Love it</button>
                  <button className={`reaction-btn ${feedbackFor(selectedMeal.id)?.reaction === 'disliked' ? 'active-disliked' : ''}`}
                    onClick={() => setFeedback(selectedMeal, 'disliked')}>👎 Not for me</button>
                </div>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} className={`star-btn ${(feedbackFor(selectedMeal.id)?.rating ?? 0) >= star ? 'active' : ''}`}
                      onClick={() => setRating(selectedMeal, star)}>⭐</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelectedMeal(null)}>Close</button>
              <button className="btn-primary" onClick={() => logMealNow(selectedMeal)}>Log {portionSize}x serving to today</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlan;

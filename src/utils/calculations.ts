export const calculateBMR = (weightLbs: number, heightInches: number, age: number): number => {
  const weightKg = weightLbs * 0.453592;
  const heightCm = heightInches * 2.54;
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
};

export const calculateTDEE = (bmr: number): number => Math.round(bmr * 1.4);

export const calculateTargetCalories = (tdee: number): number => Math.max(1300, tdee - 750);

export const calculateProteinTarget = (weightLbs: number): number => Math.round(weightLbs * 0.75);

export const calculateCurrentPhase = (startDate: string): 1 | 2 | 3 | 4 => {
  const start = new Date(startDate);
  const now = new Date();
  const weeksElapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
  if (weeksElapsed < 6) return 1;
  if (weeksElapsed < 14) return 2;
  if (weeksElapsed < 22) return 3;
  return 4;
};

export const calculateCurrentWeek = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  return Math.max(1, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1);
};

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const todayStr = (): string => new Date().toISOString().split('T')[0];

export const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const USER_PROFILE = {
  name: 'You',
  age: 30,
  startWeight: 191,
  targetWeight: 141,
  heightInches: 64,
  startDate: new Date().toISOString().split('T')[0],
};

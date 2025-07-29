const API_URL = 'http://localhost:3001';

export interface User {
  id: number;
  email: string;
  goal: string;
  preferences: string[];
  lastPeriodDate: string;
}

export interface Workout {
  id: number;
  title: string;
  type: string;
  videoId: string;
  intensity: string;
  description: string;
}

export interface WorkoutPlan {
  id: number;
  userId: number;
  workouts: {
    day: number;
    workoutId: number | null;
    completed: boolean;
  }[];
}

export interface MoodTracking {
  id: number;
  userId: number;
  workoutId: number;
  energyLevel: number;
  moodLevel: number;
  date: string;
}

// API calls
export const api = {
  // Users
  async createUser(data: Omit<User, 'id'>) {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Workouts
  async getWorkouts() {
    const res = await fetch(`${API_URL}/workouts`);
    return res.json();
  },

  async getWorkout(id: number) {
    const res = await fetch(`${API_URL}/workouts/${id}`);
    return res.json();
  },

  // Plans
  async getPlan(userId: number) {
    const res = await fetch(`${API_URL}/plans?userId=${userId}`);
    const plans = await res.json();
    return plans[0]; // Get first plan
  },

  async updatePlan(id: number, data: Partial<WorkoutPlan>) {
    const res = await fetch(`${API_URL}/plans/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async createPlan(data: { userId: number; workouts: any[] }) {
    const res = await fetch(`${API_URL}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Mood Tracking
  async saveMood(data: Omit<MoodTracking, 'id'>) {
    const res = await fetch(`${API_URL}/moodTracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
}; 
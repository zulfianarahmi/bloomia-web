const API_URL = 'http://localhost:3002';

// Static data fallback for faster loading
const STATIC_WORKOUTS = [
  {
    "id": 1,
    "title": "Full Body Strength untuk Pemula",
    "type": "strength",
    "videoId": "CD6BCdFHogg",
    "intensity": "medium",
    "description": "Workout full body untuk pemula, fokus pada form dan teknik dasar"
  },
  {
    "id": 2,
    "title": "Upper Body Workout",
    "type": "strength",
    "videoId": "oOEgcLUfmj8",
    "intensity": "medium",
    "description": "Workout fokus otot atas (dada, punggung, bahu)"
  },
  {
    "id": 3,
    "title": "Lower Body Workout",
    "type": "strength",
    "videoId": "kCYLoP4TJFE",
    "intensity": "medium",
    "description": "Workout fokus otot bawah (kaki, glutes)"
  },
  {
    "id": 4,
    "title": "Core Workout",
    "type": "strength",
    "videoId": "x33O9qGN_us",
    "intensity": "medium",
    "description": "Workout fokus otot inti (perut, pinggang)"
  },
  {
    "id": 5,
    "title": "Bodyweight Exercises",
    "type": "strength",
    "videoId": "30PqX2zvK88",
    "intensity": "light",
    "description": "Latihan menggunakan berat badan (push-up, squat, plank)"
  },
  {
    "id": 6,
    "title": "Morning Yoga Flow",
    "type": "yoga",
    "videoId": "6bq2uUN-oSY",
    "intensity": "light",
    "description": "Yoga flow untuk memulai hari dengan semangat"
  }
];

// Simple cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Check if backend is available
async function isBackendAvailable() {
  try {
    const response = await fetch(`${API_URL}/workouts`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

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
  duration?: number;
  level?: string;
  equipment?: string;
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

export interface Progress {
  id: number;
  userId: number;
  workoutId: number;
  workoutTitle: string;
  date: string;
  completed: boolean;
  notes?: string;
  mood: string;
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
    const cacheKey = 'workouts';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;
    
    // Try backend first, fallback to static data
    const backendAvailable = await isBackendAvailable();
    if (backendAvailable) {
      try {
        const res = await fetch(`${API_URL}/workouts`);
        const data = await res.json();
        setCachedData(cacheKey, data);
        return data;
      } catch {
        // Fallback to static data
        setCachedData(cacheKey, STATIC_WORKOUTS);
        return STATIC_WORKOUTS;
      }
    } else {
      // Use static data immediately
      setCachedData(cacheKey, STATIC_WORKOUTS);
      return STATIC_WORKOUTS;
    }
  },

  async getWorkout(id: number) {
    // Try static data first for speed
    const staticWorkout = STATIC_WORKOUTS.find(w => w.id === id);
    if (staticWorkout) return staticWorkout;
    
    // Fallback to backend
    try {
      const res = await fetch(`${API_URL}/workouts/${id}`);
      return res.json();
    } catch {
      return null;
    }
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

  async createPlan(data: { userId: number; workouts: Array<{
    day: number;
    workoutId: number | null;
    completed: boolean;
  }> }) {
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

  // Progress
  async getProgress(userId: number) {
    const res = await fetch(`${API_URL}/moodTracking?userId=${userId}`);
    const moodData = await res.json();
    
    // Convert mood tracking to progress format
    return moodData.map((mood: MoodTracking) => ({
      id: mood.id,
      userId: mood.userId,
      workoutId: mood.workoutId,
      workoutTitle: `Workout ${mood.workoutId}`,
      date: mood.date,
      completed: true,
      notes: `Energy: ${mood.energyLevel}/5, Mood: ${mood.moodLevel}/5`,
      mood: mood.moodLevel > 3 ? 'Good' : mood.moodLevel > 2 ? 'Okay' : 'Bad'
    }));
  },
}; 
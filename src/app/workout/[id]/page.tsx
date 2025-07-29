"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, Workout } from "../../../services/api";
import MoodTracker from "../../../components/MoodTracker";
import { useRouter } from "next/navigation";

// Remove generateStaticParams since we're using "use client"

// Static workout data for fallback
const STATIC_WORKOUTS = [
  {
    id: 1,
    title: "Full Body Strength untuk Pemula",
    type: "strength",
    videoId: "CD6BCdFHogg",
    intensity: "medium",
    description: "Workout full body untuk pemula, fokus pada form dan teknik dasar"
  },
  {
    id: 2,
    title: "Upper Body Workout",
    type: "strength",
    videoId: "oOEgcLUfmj8",
    intensity: "medium",
    description: "Workout fokus otot atas (dada, punggung, bahu)"
  },
  {
    id: 3,
    title: "Lower Body Workout",
    type: "strength",
    videoId: "kCYLoP4TJFE",
    intensity: "medium",
    description: "Workout fokus otot bawah (kaki, glutes)"
  },
  {
    id: 4,
    title: "Core Workout",
    type: "strength",
    videoId: "x33O9qGN_us",
    intensity: "medium",
    description: "Workout fokus otot inti (perut, pinggang)"
  },
  {
    id: 5,
    title: "Bodyweight Exercises",
    type: "strength",
    videoId: "30PqX2zvK88",
    intensity: "light",
    description: "Latihan menggunakan berat badan (push-up, squat, plank)"
  },
  {
    id: 6,
    title: "Morning Yoga Flow",
    type: "yoga",
    videoId: "6bq2uUN-oSY",
    intensity: "light",
    description: "Yoga flow untuk memulai hari dengan semangat"
  }
];

export default function WorkoutDetail() {
  const params = useParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const workoutId = parseInt(params.id as string);
        
        // Try API first, fallback to static data
        try {
          const data = await api.getWorkout(workoutId);
          setWorkout(data);
        } catch {
          // Use static data if API fails
          const staticWorkout = STATIC_WORKOUTS.find(w => w.id === workoutId);
          if (staticWorkout) {
            setWorkout(staticWorkout);
          }
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        // Final fallback
        const workoutId = parseInt(params.id as string);
        const staticWorkout = STATIC_WORKOUTS.find(w => w.id === workoutId);
        if (staticWorkout) {
          setWorkout(staticWorkout);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [params.id]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <div className="text-pink-500 text-sm">Memuat detail workout...</div>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <p className="text-gray-600">Workout tidak ditemukan</p>
        <button 
          onClick={() => router.push('/planner')}
          className="mt-4 bg-pink-500 text-white px-4 py-2 rounded"
        >
          Kembali ke Planner
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-4 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">{workout.title}</h1>
        <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${workout.videoId}`}
            title={workout.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Deskripsi</h2>
            <p className="text-gray-600">{workout.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Intensitas</h2>
            <p className="text-gray-600">{workout.intensity}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Tipe</h2>
            <p className="text-gray-600">{workout.type}</p>
          </div>
        </div>
      </div>
      {!done ? (
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-8 rounded-full mb-6"
          onClick={() => setDone(true)}
        >
          Latihan Selesai
        </button>
      ) : (
        <MoodTracker onFinish={() => router.push("/planner")} />
      )}
    </main>
  );
} 
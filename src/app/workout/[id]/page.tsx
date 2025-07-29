"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, Workout } from "../../../services/api";
import MoodTracker from "../../../components/MoodTracker";
import { useRouter } from "next/navigation";

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
        const data = await api.getWorkout(workoutId);
        setWorkout(data);
      } catch (error) {
        console.error("Error fetching workout:", error);
        alert("Gagal memuat detail workout. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [params.id]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <p className="text-gray-600">Memuat detail workout...</p>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <p className="text-gray-600">Workout tidak ditemukan</p>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Durasi</h2>
            <p className="text-gray-600">{workout.duration} menit</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Level</h2>
            <p className="text-gray-600">{workout.level}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Peralatan</h2>
            <p className="text-gray-600">{workout.equipment}</p>
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
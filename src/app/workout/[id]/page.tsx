"use client";
import { useState } from "react";
import MoodTracker from "../../../components/MoodTracker";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const [done, setDone] = useState(false);
  const router = useRouter();

  // Dummy data workout
  const workout = {
    id: params.id,
    title: `Workout #${params.id}`,
    videoId: "dQw4w9WgXcQ", // Dummy YouTube ID
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">{workout.title}</h1>
      <div className="w-full max-w-xl aspect-video mb-6">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${workout.videoId}`}
          title="Workout Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
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
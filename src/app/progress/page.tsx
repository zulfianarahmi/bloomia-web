"use client";
import { useEffect, useState } from "react";
import { api, Progress } from "../../services/api";
import { useRouter } from "next/navigation";

export default function Progress() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Get user ID from localStorage (MVP)
        const userId = localStorage.getItem("userId");
        if (!userId) {
          router.push("/onboarding");
          return;
        }

        const data = await api.getProgress(parseInt(userId));
        setProgress(data);
      } catch (error) {
        console.error("Error fetching progress:", error);
        alert("Gagal memuat progress. Silakan refresh halaman.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <p className="text-gray-600">Memuat progress...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-4 py-8">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">Progress Tracking</h1>
      <div className="w-full max-w-2xl space-y-6">
        {progress.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {new Date(p.date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  p.completed
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {p.completed ? "Selesai" : "Belum Selesai"}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Workout
                </h3>
                <p className="text-gray-600">{p.workoutTitle}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Catatan
                </h3>
                <p className="text-gray-600">{p.notes || "-"}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Mood
                </h3>
                <p className="text-gray-600">{p.mood}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 
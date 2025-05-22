const workouts = [
  { id: 1, day: "Senin", type: "Strength" },
  { id: 2, day: "Selasa", type: "Yoga" },
  { id: 3, day: "Rabu", type: "Pilates" },
  { id: 4, day: "Kamis", type: "Strength" },
  { id: 5, day: "Jumat", type: "Yoga" },
  { id: 6, day: "Sabtu", type: "Pilates" },
  { id: 7, day: "Minggu", type: "Rest" },
];

import Link from "next/link";

export default function Planner() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">Planner Mingguan</h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        {workouts.map((w) => (
          <Link
            key={w.id}
            href={w.type !== "Rest" ? `/workout/${w.id}` : "#"}
            className={`block p-4 rounded-lg shadow text-center font-semibold text-lg transition border ${w.type !== "Rest" ? "bg-pink-100 hover:bg-pink-200 text-pink-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            {w.day}: {w.type}
          </Link>
        ))}
      </div>
    </main>
  );
} 
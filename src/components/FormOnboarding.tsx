"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const goals = ["Fat Loss", "Gain Muscle", "Improve Flexibility"];
const preferences = ["Strength", "Yoga", "Pilates"];

export default function FormOnboarding() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [prefs, setPrefs] = useState<string[]>([]);
  const [date, setDate] = useState("");

  const handlePrefChange = (pref: string) => {
    setPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/planner");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-md w-full mx-auto">
      <div className="mb-4">
        <label className="block mb-1 font-medium">Tujuan</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        >
          <option value="">Pilih tujuan</option>
          {goals.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Preferensi Olahraga</label>
        <div className="flex gap-4">
          {preferences.map((pref) => (
            <label key={pref} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={prefs.includes(pref)}
                onChange={() => handlePrefChange(pref)}
              />
              {pref}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Tanggal hari pertama menstruasi terakhir</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition"
      >
        Lanjutkan
      </button>
    </form>
  );
} 
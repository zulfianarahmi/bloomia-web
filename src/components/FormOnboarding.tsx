"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Workout } from "../services/api";

const goals = ["Fat Loss", "Gain Muscle", "Improve Flexibility"];
const preferences = ["Strength", "Yoga", "Pilates"];

const plannerTemplate = [
  { type: "strength", sub: "Full body", note: "Fokus angkat beban, medium-heavy" },
  { type: "yoga", sub: "Flow / Stretching", note: "Recovery, fokus kelenturan" },
  { type: "pilates", sub: "Core & Stability", note: "Penguatan otot inti dan postur" },
  { type: "strength", sub: "Upper body fokus", note: "Fokus otot atas (dada, punggung)" },
  { type: "yoga", sub: "Relax & Breath work", note: "Fokus relaksasi dan pernapasan" },
  { type: "pilates", sub: "Full body", note: "Penguatan dan fleksibilitas otot" },
  { type: "rest", sub: "Rest", note: "Recovery optimal" }
];

async function generatePlan(userId: number, prefs: string[], goal: string, menstruating: boolean): Promise<{ userId: number; workouts: { day: number; workoutId: number; completed: boolean; note: string; }[] }> {
  const allWorkouts: Workout[] = await api.getWorkouts();
  let filtered = allWorkouts.filter(w => prefs.includes(w.type));
  // Penyesuaian goal
  if (menstruating) {
    filtered = filtered.filter(w => w.intensity === "light");
  } else if (goal === "fat_loss") {
    filtered = filtered.filter(w => w.type === "strength" || w.type === "yoga" || w.type === "pilates");
  } else if (goal === "gain_muscle") {
    filtered = filtered.filter(w => w.type === "strength" || w.type === "yoga" || w.type === "pilates");
  } else if (goal === "improve_flexibility") {
    filtered = filtered.filter(w => w.type === "yoga" || w.type === "pilates" || w.type === "strength");
  }
  // Jika hasil filter < 3, tambahkan workout dari preferensi user tanpa filter intensitas
  if (filtered.length < Math.min(3, prefs.length)) {
    const extra = allWorkouts.filter(w => prefs.includes(w.type) && !filtered.includes(w));
    filtered = [...filtered, ...extra];
  }
  if (filtered.length < Math.min(3, prefs.length)) {
    filtered = allWorkouts.filter(w => prefs.includes(w.type));
  }
  // Generate planner sesuai template
  const workouts = plannerTemplate.map((tpl, idx) => {
    if (tpl.type === "rest") {
      // Untuk hari rest, set workoutId ke -1 (atau id khusus untuk rest)
      return { day: idx + 1, workoutId: -1, completed: false, note: tpl.note };
    }
    // Cari workout yang sesuai jenis dan sub (atau random jika tidak ada sub match)
    let pool = filtered.filter(w => w.type === tpl.type);
    if (menstruating) pool = pool.filter(w => w.intensity === "light");
    let workout = pool.find(w => w.title.toLowerCase().includes(tpl.sub.toLowerCase()));
    if (!workout) workout = pool[Math.floor(Math.random() * pool.length)];
    return { day: idx + 1, workoutId: workout ? workout.id : -1, completed: false, note: tpl.note };
  });
  return { userId, workouts };
}

export default function FormOnboarding() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [prefs, setPrefs] = useState<string[]>([]);
  const [isMenstruating, setIsMenstruating] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ambil rekomendasi goal dari localStorage (hasil BMI)
    const bmiGoal = localStorage.getItem("bmiGoal");
    if (bmiGoal && goals.includes(bmiGoal)) {
      setGoal(bmiGoal);
    }
  }, []);

  const handlePrefChange = (pref: string) => {
    setPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await api.createUser({
        email: "user@example.com",
        goal: goal.toLowerCase().replace(" ", "_"),
        preferences: prefs.map(p => p.toLowerCase()),
        lastPeriodDate: "" // tidak dipakai lagi
      });
      const plan = await generatePlan(user.id, prefs.map(p => p.toLowerCase()), goal.toLowerCase().replace(" ", "_"), isMenstruating === true);
      await api.createPlan(plan);
      localStorage.setItem("userId", user.id.toString());
      localStorage.removeItem("bmiGoal");
      router.push("/planner");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      alert("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
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
        <label className="block mb-1 font-medium">Apakah hari ini kamu sedang menstruasi?</label>
        <div className="flex gap-6 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="menstruasi"
              value="ya"
              checked={isMenstruating === true}
              onChange={() => setIsMenstruating(true)}
              required
            />
            Ya
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="menstruasi"
              value="tidak"
              checked={isMenstruating === false}
              onChange={() => setIsMenstruating(false)}
              required
            />
            Tidak
          </label>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Menyimpan..." : "Lanjutkan"}
      </button>
    </form>
  );
} 
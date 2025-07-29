"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { api, WorkoutPlan, Workout } from "../../services/api";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function Planner() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [todayWorkout, setTodayWorkout] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editPlanner, setEditPlanner] = useState<Array<{
    day: number;
    workoutId: number | null;
    completed: boolean;
    note?: string;
  }>>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const plannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          router.push("/onboarding");
          return;
        }
        const [planData, workoutsData] = await Promise.all([
          api.getPlan(parseInt(userId)),
          api.getWorkouts()
        ]);
        setPlan(planData);
        setWorkouts(workoutsData);
        setEditPlanner(planData.workouts.map(w => ({ ...w })));
      } catch (error) {
        console.error("Error fetching planner data:", error);
        alert("Gagal memuat jadwal. Silakan refresh halaman.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    if (plan && workouts.length > 0) {
      const today = new Date().getDay();
      const dayNum = today === 0 ? 7 : today;
      const planToday = plan.workouts.find(w => w.day === dayNum);
      if (planToday && planToday.workoutId) {
        const workout = workouts.find(w => w.id === planToday.workoutId);
        if (workout) {
          setTodayWorkout(workout.title);
          setShowReminder(true);
        }
      }
    }
  }, [plan, workouts]);

  const handleDownloadPNG = async () => {
    if (plannerRef.current) {
      const canvas = await html2canvas(plannerRef.current, { backgroundColor: null });
      const link = document.createElement("a");
      link.download = "jadwal-latihan.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    if (plannerRef.current) {
      const canvas = await html2canvas(plannerRef.current, { backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("jadwal-latihan.pdf");
    }
  };

  const handleEditChange = (dayIdx: number, type: string, value: string | number | null) => {
    setEditPlanner(prev => prev.map((item, idx) => {
      if (idx !== dayIdx) return item;
      if (type === "type") {
        const firstWorkout = workouts.find(w => w.type === value);
        return { ...item, workoutId: firstWorkout ? firstWorkout.id : null };
      }
      if (type === "workoutId") {
        return { ...item, workoutId: value };
      }
      return item;
    }));
  };

  const handleSavePlanner = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      await api.updatePlan(plan.id, { workouts: editPlanner });
      setPlan({ ...plan, workouts: editPlanner });
      setEditMode(false);
      alert("Jadwal berhasil disimpan!");
    } catch {
      alert("Gagal menyimpan jadwal");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <p className="text-gray-600">Memuat jadwal...</p>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <p className="text-gray-600">Jadwal tidak ditemukan. Silakan isi onboarding terlebih dahulu.</p>
        <Link href="/onboarding" className="mt-4 text-pink-600 hover:underline">
          Kembali ke Onboarding
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      {showReminder && todayWorkout && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2 text-pink-600">Reminder Latihan!</h2>
            <p className="mb-4">Hari ini jadwal latihan: <b>{todayWorkout}</b></p>
            <button
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded"
              onClick={() => setShowReminder(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-2 mb-4 items-center">
        <div className="flex gap-2">
          <button onClick={handleDownloadPNG} className="bg-pink-500 text-white px-4 py-2 rounded shadow">Download PNG</button>
          <button onClick={handleDownloadPDF} className="bg-pink-500 text-white px-4 py-2 rounded shadow">Download PDF</button>
        </div>
        <span className="text-xs text-gray-500 mt-2 md:mt-0">*Download hanya area planner, bukan tombol</span>
        {!editMode && (
          <button onClick={() => setEditMode(true)} className="bg-yellow-500 text-white px-4 py-2 rounded shadow">Edit Jadwal</button>
        )}
        {editMode && (
          <button onClick={handleSavePlanner} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded shadow">
            {saving ? "Menyimpan..." : "Simpan Jadwal"}
          </button>
        )}
        {editMode && (
          <button onClick={() => { setEditPlanner(plan.workouts.map(w => ({ ...w }))); setEditMode(false); }} className="bg-gray-400 text-white px-4 py-2 rounded shadow">Batal</button>
        )}
      </div>
      <div ref={plannerRef} className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">Planner Mingguan</h1>
        <div className="grid grid-cols-1 gap-4">
          {(editMode ? editPlanner : plan.workouts).map((w, idx) => {
            const workout = workouts.find(wo => wo.id === w.workoutId);
            const type = workout ? workout.type : "rest";
            const workoutOptions = workouts.filter(wo => wo.type === type);
            const cardContent = (
              <div className={`block p-4 rounded-xl shadow text-center font-semibold text-lg border transition bg-gradient-to-br ${editMode ? 'from-pink-50 to-pink-100 border-pink-200' : 'from-pink-100 to-white border-pink-100'} hover:shadow-lg ${!editMode && w.workoutId ? 'cursor-pointer hover:scale-[1.03]' : ''}`}>
                <div className="mb-2 font-bold text-pink-600 text-xl tracking-wide">{dayNames[w.day - 1]}</div>
                {editMode && w.day !== 7 ? (
                  <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
                    <select
                      className="border border-pink-300 rounded px-2 py-1 mr-2 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                      value={type}
                      onChange={e => handleEditChange(idx, "type", e.target.value)}
                    >
                      <option value="strength">Strength</option>
                      <option value="yoga">Yoga</option>
                      <option value="pilates">Pilates</option>
                    </select>
                    <select
                      className="border border-pink-300 rounded px-2 py-1 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                      value={w.workoutId || ""}
                      onChange={e => handleEditChange(idx, "workoutId", Number(e.target.value))}
                    >
                      {workoutOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.title}</option>
                      ))}
                    </select>
                  </div>
                ) : w.day !== 7 && workout ? (
                  <>
                    <div className="mt-2 text-pink-800 text-lg">{workout.title}</div>
                    <div className="text-sm text-gray-600 mt-1">Jenis: <span className="capitalize">{workout.type}</span> | Intensitas: <span className="capitalize">{workout.intensity}</span></div>
                  </>
                ) : (
                  <div className="mt-2 text-pink-800 text-lg">Rest</div>
                )}
              </div>
            );
            if (!editMode && w.workoutId) {
              return (
                <Link key={w.day} href={`/workout/${w.workoutId}`} passHref legacyBehavior>
                  <a style={{ textDecoration: 'none' }}>{cardContent}</a>
                </Link>
              );
            }
            return (
              <div key={w.day}>{cardContent}</div>
            );
          })}
        </div>
      </div>
    </main>
  );
} 
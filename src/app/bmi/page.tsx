"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { label: "Underweight", goal: "Gain Muscle", desc: "Berat badan kurang. Disarankan fokus ke peningkatan massa otot." };
  if (bmi < 23) return { label: "Normal", goal: "Improve Flexibility", desc: "Berat badan ideal. Bisa fokus ke fleksibilitas atau kebugaran umum." };
  if (bmi < 25) return { label: "Overweight", goal: "Fat Loss", desc: "Berat badan sedikit berlebih. Disarankan fokus ke fat loss." };
  return { label: "Obese", goal: "Fat Loss", desc: "Berat badan berlebih. Disarankan fokus ke fat loss dan kesehatan metabolik." };
};

export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<{ label: string; goal: string; desc: string } | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return;
    const bmiVal = w / (h * h);
    setBmi(bmiVal);
    setCategory(getBMICategory(bmiVal));
  };

  const handleLanjut = () => {
    if (category) {
      // Simpan rekomendasi goal ke localStorage untuk onboarding
      localStorage.setItem("bmiGoal", category.goal);
      router.push("/onboarding");
    }
  };

  const handleFAQ = () => {
    router.push("/faq");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-pink-50 px-4">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl items-start justify-center">
        <div className="bg-white p-6 rounded-lg shadow max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-pink-600 mb-4 text-center">Cek BMI & Rekomendasi</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Berat Badan (kg)</label>
              <input type="number" min="30" max="200" className="w-full border rounded px-3 py-2" value={weight} onChange={e => setWeight(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Tinggi Badan (cm)</label>
              <input type="number" min="120" max="220" className="w-full border rounded px-3 py-2" value={height} onChange={e => setHeight(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Umur</label>
              <input type="number" min="10" max="80" className="w-full border rounded px-3 py-2" value={age} onChange={e => setAge(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition">Cek BMI</button>
          </form>
          {bmi && category && (
            <div className="mt-6 text-center">
              <div className="text-2xl font-bold text-pink-600 mb-2">BMI: {bmi.toFixed(1)}</div>
              <div className="text-lg font-semibold mb-1">Kategori: {category.label}</div>
              <div className="text-gray-700 mb-4">{category.desc}</div>
              <button onClick={handleLanjut} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-8 rounded-full transition">Lanjut ke Onboarding</button>
            </div>
          )}
        </div>
        <div className="w-full md:w-72 flex-shrink-0">
          <div
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer hover:bg-pink-100 transition border border-pink-200"
            onClick={handleFAQ}
          >
            <div className="mb-2 text-pink-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a3.375 3.375 0 016.75 0c0 1.824-1.51 2.688-2.376 3.1-.882.418-1.499 1.2-1.499 2.025m.75 3.375h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div className="font-bold text-lg mb-1 text-pink-700">Pertanyaan seputar gym</div>
            <div className="text-gray-600 text-sm text-center">Beberapa pertanyaan seputar gym yang sering diajukan</div>
          </div>
        </div>
      </div>
    </main>
  );
} 
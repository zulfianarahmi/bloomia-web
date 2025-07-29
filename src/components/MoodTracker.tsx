"use client";
import { useState } from "react";

export default function MoodTracker({ onFinish }: { onFinish?: () => void }) {
  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFinish) {
      onFinish();
    } else {
      window.location.href = "/done";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-pink-50 p-6 rounded-lg shadow max-w-md w-full mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-pink-600">Mood Tracker</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Energi: {energy}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full accent-pink-500"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Mood: {mood}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full accent-pink-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition"
      >
        Simpan & Kembali
      </button>
    </form>
  );
} 
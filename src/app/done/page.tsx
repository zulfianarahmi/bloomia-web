"use client";
import { useRouter } from "next/navigation";

export default function Done() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-pink-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-pink-600 mb-2">Yeay, Selesai!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Kamu hebat! Satu langkah lebih dekat ke versi terbaik dirimu.<br />
          <span className="font-semibold text-pink-500">Tetap semangat dan konsisten workout ya!</span>
        </p>
        <button
          onClick={() => router.push("/planner")}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-8 rounded-full transition"
        >
          Kembali ke Planner
        </button>
      </div>
    </main>
  );
} 
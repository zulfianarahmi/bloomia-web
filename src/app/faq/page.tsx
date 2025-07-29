"use client";
import { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      q: "Apakah perempuan boleh angkat beban di gym?",
      a: "Tentu saja! Angkat beban sangat baik untuk kesehatan tulang, metabolisme, dan membentuk tubuh. Tidak perlu takut jadi 'berotot', karena hormon perempuan berbeda dengan laki-laki." 
    },
    {
      q: "Apa manfaat yoga untuk perempuan?",
      a: "Yoga membantu fleksibilitas, mengurangi stres, dan meningkatkan keseimbangan hormon. Sangat baik dilakukan di segala usia."
    },
    {
      q: "Bagaimana cara memulai latihan di gym untuk pemula?",
      a: "Mulailah dengan latihan dasar, fokus pada teknik, dan jangan ragu bertanya pada trainer. Lakukan pemanasan dan pendinginan setiap sesi."
    },
    {
      q: "Apakah olahraga saat menstruasi aman?",
      a: "Aman! Justru olahraga ringan seperti yoga, pilates, atau jalan kaki bisa membantu mengurangi nyeri haid. Dengarkan tubuhmu dan pilih latihan yang nyaman."
    },
    {
      q: "Berapa kali idealnya latihan dalam seminggu?",
      a: "3-5 kali per minggu sudah cukup untuk hasil optimal, dengan kombinasi strength, yoga, dan pilates."
    },
    {
      q: " Apa saja alat workout di rumah yang wajib punya?",
      a: "Adjustable dumbbells & pull up bar."
    },
    {
      q: " Kenapa harus punya alat-alat ini?",
      a: "Dumbbell: Beban bisa diatur, hemat tempat, cocok untuk latihan rutin. Pull up bar: Kokoh, anti selip, bisa untuk pull up, chin up, inverted row, front lever, & back lever."
    },
    {
      q: " Berapa variasi beban dumbbellnya?",
      a: "2.5 kg ×4, 1.25 kg ×4, plus 2 kg bar & spinlock."
    },
    {
      q: " Apa saja latihan core yang direkomendasikan?",
      a: "Hanging knee raises, hanging leg raises, toes to bar, dan L-sit. (Catatan: Sit ups tidak direkomendasikan, ganti crunches untuk mengurangi risiko cedera punggung.)"
    },
    {
      q: " Apa latihan efektif untuk lower body?",
      a: "Quads: Bulgarian split squats (lebih bagus dengan beban tambahan). Hamstrings: Banded deadlifts. Glutes: Banded Romanian deadlifts & Bulgarian split squats. Calves: Variasi calf raises."
    },
    {
      q: " Apa gerakan upper body dari mudah ke sulit?",
      a: "Wall push ups → Incline push ups → Knee push ups → Knuckle push ups → Pike push ups → Spiderman push ups → Close grip push ups → Single arm push ups → Lying/floor back extension"
    },
    {
      q: " Ada tips tambahan atau gerakan alternatif?",
      a: "Coba bar curls & pelican curls sebagai alternatif latihan punggung/arm tanpa dumbbell atau barbel."
    },
    {
      q: " Apakah kehilangan massa otot bisa dicegah sepenuhnya saat diet?",
      a: "Tidak selalu 100%. Risiko meningkat jika defisit energi terlalu ekstrem, protein rendah, atau body fat sudah sangat rendah."
    },
    {
      q: " Apa yang bisa meminimalisir kehilangan massa otot?",
      a: "Latihan beban lebih efektif dibanding olahraga aerobik untuk menjaga massa otot."
    },
    {
      q: " Berapa kali latihan beban minimal yang direkomendasikan WHO?",
      a: "Minimal 2 kali per minggu dengan intensitas sedang–tinggi."
    },
    {
      q: " Kenapa latihan beban penting saat defisit kalori?",
      a: "Membantu mempertahankan massa otot, memperkuat tubuh, dan mendukung metabolisme."
    },
    {
      q: " Bagaimana cara memulai latihan beban?",
      a: "Mulai dari gerakan dasar seperti squat, push up, deadlift ringan, atau pakai resistance band & dumbbell di rumah."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center bg-pink-50 px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-6 mx-auto">
        <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">FAQ Seputar GYM & Fitness Perempuan</h1>
        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="border-b pb-2">
              <button
                className="w-full text-left flex justify-between items-center font-semibold text-pink-700 py-2 focus:outline-none"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                aria-expanded={openIdx === idx}
                aria-controls={`faq-panel-${idx}`}
              >
                <span>Q: {item.q}</span>
                <span className={`transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <div
                id={`faq-panel-${idx}`}
                className={`overflow-hidden transition-all duration-300 ${openIdx === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="text-gray-700 pl-2 pr-1 py-2">A: {item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 
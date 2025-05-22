export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-white px-4">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">Bloomia</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Fitness hybrid untuk perempuan. Mulai perjalanan sehatmu dengan program yang sesuai siklus dan tujuanmu!
        </p>
        <a
          href="/onboarding"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow transition"
        >
          Mulai Sekarang
        </a>
      </div>
      <footer className="mt-16 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Bloomia. All rights reserved.
      </footer>
    </main>
  );
}

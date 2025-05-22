import FormOnboarding from "../../components/FormOnboarding";

export default function Onboarding() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-pink-50 px-4">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">Onboarding</h1>
      <FormOnboarding />
    </main>
  );
}

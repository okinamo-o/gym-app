import { AIGenerator } from "@/components/workout/AIGenerator";

export const metadata = {
  title: "AI Architect | Lyfta Next-Gen",
};

export default function AIGeneratorPage() {
  return (
    <main className="min-h-screen bg-background pt-20 px-4">
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-center text-white mb-4">Intelligence Engine</h1>
        <p className="text-center text-white/60">Bypass the guesswork. Let our systems synthesize your progression.</p>
      </div>
      <AIGenerator />
    </main>
  );
}

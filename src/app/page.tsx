import { Hero } from "@/components/marketing/Hero";
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase";
import { QuickStartSplits } from "@/components/marketing/QuickStartSplits";
import { CallToAction } from "@/components/marketing/CallToAction";
import { getFreeExercises } from "@/lib/api/exercises";
import { FeaturedGrid } from "@/components/exercise/FeaturedGrid";

export default async function Home() {
  const exercises = await getFreeExercises();
  // Pick 8 varied exercises for the featured section
  const featured = exercises.filter((_, i) => i % 100 === 0).slice(0, 8);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center">
      <Hero />
      <FeatureShowcase />
      <QuickStartSplits />
      
      <section className="py-24 px-4 w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-heading text-white mb-4">Explore Movement Mechanics</h2>
          <p className="text-lg text-white/60">A glimpse into our expansive database of 870+ categorized exercises.</p>
        </div>
        <FeaturedGrid exercises={featured} />
      </section>

      <CallToAction />
    </main>
  );
}

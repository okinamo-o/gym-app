import { notFound } from "next/navigation";
import { getExerciseBySlug } from "@/lib/actions/exercise";
import { GlassCard } from "@/components/ui/glass-card";
import { InjurySubstitution } from "@/components/exercise/InjurySubstitution";
import Link from "next/link";

export default async function ExerciseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const exercise = await getExerciseBySlug(resolvedParams.slug);

  if (!exercise) {
    notFound();
  }

  const instructions = exercise.instructions || [];

  return (
    <main className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Library
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 items-start md:items-end justify-between">
          <div>
            <div className="flex gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/20 text-primary border border-primary/20 capitalize">
                {exercise.level}
              </span>
              {exercise.equipment && (
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/10 text-white border border-white/10 capitalize">
                  {exercise.equipment}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-white">{exercise.name}</h1>
          </div>
          
          <div className="flex gap-2">
             {exercise.primaryMuscles.map(m => (
               <div key={m} className="text-right">
                 <span className="block text-xs text-white/40 uppercase tracking-wider">Primary</span>
                 <span className="text-white font-medium capitalize">{m}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Bento Box Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Media Player Placeholder */}
          <div className="lg:col-span-2">
            <GlassCard className="aspect-video flex items-center justify-center p-0 overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-50 mix-blend-overlay" />
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                 </div>
                 <p className="text-white/60 font-heading tracking-widest uppercase text-sm">Cinematic Demo</p>
               </div>
            </GlassCard>

            <InjurySubstitution exerciseId={exercise.id} exerciseName={exercise.name} />
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
            <GlassCard>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Execution
              </h3>
              <ol className="space-y-4">
                {instructions.map((step: string, index: number) => (
                  <li key={index} className="flex gap-4 text-white/80 text-sm">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold font-heading text-white">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </GlassCard>


          </div>

        </div>
      </div>
    </main>
  );
}

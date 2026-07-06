import { getFreeExercises } from "@/lib/api/exercises";
import { ExerciseClientGrid } from "@/components/library/ExerciseClientGrid";
import { Suspense } from "react";
import { ExerciseCardSkeleton } from "@/components/library/ExerciseCard";

export const metadata = {
  title: "Open Library | Lyfta Next-Gen",
};

export default async function LibraryPage() {
  const exercises = await getFreeExercises();

  return (
    <main className="min-h-screen bg-background pt-20">
      <Suspense fallback={
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-12 relative z-10">
          <div className="mb-12 animate-pulse">
            <div className="h-12 bg-white/10 rounded w-64 mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-96"></div>
          </div>
          <div className="flex flex-col gap-4 mb-8 animate-pulse">
            <div className="h-14 bg-white/10 rounded-2xl w-full"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-12 bg-white/10 rounded-xl"></div>
              <div className="h-12 bg-white/10 rounded-xl"></div>
              <div className="h-12 bg-white/10 rounded-xl"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <ExerciseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <ExerciseClientGrid initialExercises={exercises} />
      </Suspense>
    </main>
  );
}

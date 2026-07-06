"use client";

import Image from "next/image";
import { FreeExercise, IMAGE_BASE_URL } from "@/lib/api/exercises";
import { GlassCard } from "@/components/ui/glass-card";

interface ExerciseCardProps {
  exercise: FreeExercise;
  onClick: (exercise: FreeExercise) => void;
}

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  // Use the first image as thumbnail
  const thumbnailUrl = exercise.images && exercise.images.length > 0
    ? `${IMAGE_BASE_URL}${exercise.images[0]}`
    : null;

  return (
    <GlassCard 
      className="cursor-pointer group h-full flex flex-col p-4"
      onClick={() => onClick(exercise)}
      hoverEffect={true}
    >
      <div className="relative w-full aspect-[4/3] bg-white/5 rounded-lg mb-4 overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={exercise.name}
            fill
            className="object-cover mix-blend-overlay group-hover:mix-blend-normal transition-all duration-300 opacity-80 group-hover:opacity-100"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 font-heading">
            No Image
          </div>
        )}
      </div>

      <h3 className="font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">
        {exercise.name}
      </h3>

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {exercise.primaryMuscles.slice(0, 2).map(m => (
          <span key={m} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-primary/20 text-primary border border-primary/20">
            {m}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}

export function ExerciseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse h-full flex flex-col">
      <div className="w-full aspect-[4/3] bg-white/10 rounded-lg mb-4"></div>
      <div className="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-1/2 mt-auto"></div>
    </div>
  );
}

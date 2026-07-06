"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FreeExercise, IMAGE_BASE_URL } from "@/lib/api/exercises";
import { GlassCard } from "@/components/ui/glass-card";

export function FeaturedGrid({ exercises }: { exercises: FreeExercise[] }) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-20 relative z-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">
            Featured Exercises
          </h2>
          <p className="text-white/50 mt-2">A curated selection from 870+ movements.</p>
        </div>
        <Link
          href="/library"
          className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
        >
          View Full Library
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {exercises.map((exercise, index) => {
          const thumbnailUrl = exercise.images && exercise.images.length > 0
            ? `${IMAGE_BASE_URL}${exercise.images[0]}`
            : null;

          return (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Link href="/library">
                <GlassCard className="cursor-pointer group h-full flex flex-col p-4">
                  <div className="relative w-full aspect-[4/3] bg-white/5 rounded-lg mb-4 overflow-hidden">
                    {thumbnailUrl ? (
                      <Image
                        src={thumbnailUrl}
                        alt={exercise.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 font-heading text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-sm md:text-base leading-tight group-hover:text-primary transition-colors">
                    {exercise.name}
                  </h3>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {exercise.primaryMuscles.slice(0, 2).map(m => (
                      <span key={m} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-primary/20 text-primary border border-primary/20">
                        {m}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/library" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">
          View Full Library →
        </Link>
      </div>
    </section>
  );
}

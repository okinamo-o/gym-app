"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FreeExercise, IMAGE_BASE_URL } from "@/lib/api/exercises";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useEffect, useState } from "react";
import { useWorkout } from "@/lib/context/WorkoutContext";

interface ExerciseDetailModalProps {
  exercise: FreeExercise | null;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, onClose }: ExerciseDetailModalProps) {
  const { addExercise } = useWorkout();
  const [added, setAdded] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (exercise) {
      document.body.style.overflow = "hidden";
      setAdded(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [exercise]);

  // #11: Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (exercise) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [exercise, onClose]);

  const handleAdd = () => {
    if (exercise) {
      addExercise(exercise.name, exercise.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {exercise && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close exercise details"
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-colors border border-white/10"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Media Section */}
            <div className="w-full md:w-1/2 bg-black/40 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center justify-center p-6 space-y-4">
              {exercise.images && exercise.images.length > 0 ? (
                exercise.images.map((img, idx) => (
                  <div key={idx} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                    <Image
                      src={`${IMAGE_BASE_URL}${img}`}
                      alt={`${exercise.name} Step ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))
              ) : (
                <div className="w-full aspect-square flex items-center justify-center border border-dashed border-white/20 rounded-xl text-white/40 font-heading">
                  No images available
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/20 text-primary border border-primary/20 capitalize">
                    {exercise.level}
                  </span>
                  {exercise.equipment && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/10 text-white border border-white/10 capitalize">
                      {exercise.equipment}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-white">{exercise.name}</h2>
              </div>

              <div className="space-y-6 flex-1">
                {/* Muscles Highlight */}
                <div>
                  <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Muscles Engaged</h4>
                  <div className="flex flex-wrap gap-2">
                    {exercise.primaryMuscles.map(m => (
                      <span key={m} className="px-3 py-1 text-sm rounded bg-primary/10 text-primary border border-primary/20 capitalize">
                        {m} (Primary)
                      </span>
                    ))}
                    {exercise.secondaryMuscles.map(m => (
                      <span key={m} className="px-3 py-1 text-sm rounded bg-secondary/10 text-secondary-foreground border border-secondary/20 capitalize">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Execution</h4>
                  <ol className="space-y-4">
                    {exercise.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-4 text-white/80 text-sm leading-relaxed">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold text-white mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <MagneticButton
                  intensity={0.1}
                  className={`w-full py-4 text-lg font-bold transition-colors ${
                    added ? "bg-green-600 hover:bg-green-600" : ""
                  }`}
                  onClick={handleAdd}
                >
                  {added ? "✓ Added to Workout!" : "Add to Workout"}
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

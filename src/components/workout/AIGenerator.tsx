"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateWorkout, AIWorkoutResult, getAlternativeExercise, getMultipleAlternativeExercises, GeneratedExercise } from "@/lib/actions/ai";
import { FreeExercise } from "@/lib/api/exercises";
import { GlassCard } from "@/components/ui/glass-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useWorkout } from "@/lib/context/WorkoutContext";
import { useRouter } from "next/navigation";
import { ExerciseCard } from "@/components/library/ExerciseCard";

export function AIGenerator() {
  const [split, setSplit] = useState("push");
  const [level, setLevel] = useState("intermediate");
  const [volume, setVolume] = useState("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AIWorkoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [swapModalData, setSwapModalData] = useState<{
    isOpen: boolean;
    exerciseIndex: number | null;
    originalItem: GeneratedExercise | null;
    alternatives: FreeExercise[];
    isLoading: boolean;
  }>({ isOpen: false, exerciseIndex: null, originalItem: null, alternatives: [], isLoading: false });

  const { reorderExercises, setWorkoutName } = useWorkout();
  const router = useRouter();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateWorkout(split, level, volume);
      if (data) {
        setResult(data);
      } else {
        setError("Failed to synthesize routine. Our AI database might be empty or disconnected.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try generating again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const openSwapModal = async (item: GeneratedExercise, index: number) => {
    if (!result) return;
    setSwapModalData(prev => ({ ...prev, isOpen: true, exerciseIndex: index, originalItem: item, isLoading: true, alternatives: [] }));
    const avoidIds = result.exercises.map(e => e.exercise.id);
    const alts = await getMultipleAlternativeExercises(item.exercise.id, item.exercise.primaryMuscles, avoidIds, 3);
    setSwapModalData(prev => ({ ...prev, alternatives: alts, isLoading: false }));
  };

  const confirmSwap = (alternative: FreeExercise) => {
    if (!result || swapModalData.exerciseIndex === null) return;
    const updatedExercises = [...result.exercises];
    updatedExercises[swapModalData.exerciseIndex] = {
      ...updatedExercises[swapModalData.exerciseIndex],
      exercise: alternative,
    };
    setResult({ ...result, exercises: updatedExercises });
    setSwapModalData({ isOpen: false, exerciseIndex: null, originalItem: null, alternatives: [], isLoading: false });
  };

  const handleImportToBuilder = () => {
    if (!result) return;
    
    // Map AI exercises to Workout Context Item structure
    const workoutItems = result.exercises.map((ex) => ({
      id: ex.id,
      exerciseId: ex.exercise.id,
      name: ex.exercise.name,
      sets: ex.sets,
      reps: ex.reps,
      restTime: ex.restTime
    }));

    setWorkoutName(result.workoutName);
    reorderExercises(workoutItems);
    router.push("/workout-builder");
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <GlassCard className="p-6 md:p-10 border border-white/10 bg-white/5 mb-8">
        <h2 className="text-3xl font-bold font-heading text-white mb-2 flex items-center gap-3">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Workout Architect
        </h2>
        <p className="text-white/60 mb-8">
          Select your split and experience level. Our intelligence engine will build a visually mapped routine. Don't like an exercise? Swap it out instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Workout Split</label>
            <div className="flex flex-wrap gap-2">
              {["push", "pull", "legs", "upper-body", "lower-body", "full-body"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSplit(s)}
                  className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
                    split === s ? "bg-primary text-primary-foreground font-semibold" : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {s.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Experience Level</label>
            <div className="flex flex-wrap gap-2">
              {["beginner", "intermediate", "advanced"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
                    level === l ? "bg-secondary text-secondary-foreground font-semibold" : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Workout Volume</label>
            <div className="flex flex-wrap gap-2">
              {["short", "standard", "long"].map((v) => (
                <button
                  key={v}
                  onClick={() => setVolume(v)}
                  className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
                    volume === v ? "bg-white text-black font-semibold" : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8">
          <MagneticButton  
            intensity={0.2} 
            className="w-full py-4 text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed" 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Synthesizing visual routine..." : "Generate Optimal Workout"}
          </MagneticButton>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive-foreground text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-3xl font-bold font-heading text-white">{result.workoutName}</h3>
              <p className="text-white/50">{result.exercises.length} exercises • ~{result.estimatedTime} mins</p>
            </div>
            
            <MagneticButton
              intensity={0.1}
              onClick={handleImportToBuilder}
              className="px-6 py-3 bg-white text-black font-bold hover:bg-white/90 transition-colors shrink-0"
            >
              Build & Save Routine →
            </MagneticButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {result.exercises.map((item, idx) => (
                <motion.div 
                  key={item.id} // using generated id here avoids full remount on swap if we keep the same outer wrapper, but since we swap the exercise, we can animate it
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                  <ExerciseCard exercise={item.exercise} onClick={() => {}} />
                  
                  {/* Swap Overlay Button */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openSwapModal(item, idx);
                      }}
                      className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer pointer-events-auto"
                      title="Swap Alternative"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="17 1 21 5 17 9"></polyline>
                        <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                        <polyline points="7 23 3 19 7 15"></polyline>
                        <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Alternative Selection Modal */}
      <AnimatePresence>
        {swapModalData.isOpen && swapModalData.originalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSwapModalData(prev => ({ ...prev, isOpen: false }))}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <GlassCard className="p-6 md:p-8 border border-white/10 bg-background/80">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold font-heading text-white">Select Alternative</h3>
                  <button 
                    onClick={() => setSwapModalData(prev => ({ ...prev, isOpen: false }))}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-white/60 mb-6">
                  Swapping out <span className="text-white font-bold">{swapModalData.originalItem.exercise.name}</span>. Here are 3 alternatives targeting the same muscles:
                </p>
                
                {swapModalData.isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : swapModalData.alternatives.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {swapModalData.alternatives.map(alt => (
                      <div key={alt.id} className="relative group">
                        <ExerciseCard exercise={alt} onClick={() => {}} />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
                          <MagneticButton
                            intensity={0.2}
                            onClick={() => confirmSwap(alt)}
                            className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full pointer-events-auto"
                          >
                            Select Exercise
                          </MagneticButton>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-white/50 py-10">No suitable alternatives found.</p>
                )}
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

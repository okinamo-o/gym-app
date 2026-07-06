"use client";

import { useState, useEffect } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useWorkout, WorkoutItem } from "@/lib/context/WorkoutContext";
import { saveWorkoutAction, getSavedWorkouts, deleteWorkoutAction } from "@/lib/actions/workout";

interface RoutineExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  restTime: number;
}

interface SavedRoutine {
  id: string;
  name: string;
  createdAt: Date;
  exercises: RoutineExercise[];
}

export function WorkoutBuilder() {
  const {
    exercises,
    workoutName,
    setWorkoutName,
    removeExercise,
    reorderExercises,
    clearWorkout,
  } = useWorkout();

  const [activeTab, setActiveTab] = useState<"builder" | "routines">("builder");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);
  
  // Saved routines states
  const [savedRoutines, setSavedRoutines] = useState<SavedRoutine[]>([]);
  const [isLoadingRoutines, setIsLoadingRoutines] = useState(false);

  // Load routines when the tab switches
  useEffect(() => {
    if (activeTab === "routines") {
      fetchRoutines();
    }
  }, [activeTab]);

  const fetchRoutines = async () => {
    setIsLoadingRoutines(true);
    const res = await getSavedWorkouts();
    if (res.success && res.workouts) {
      setSavedRoutines(res.workouts as SavedRoutine[]);
    }
    setIsLoadingRoutines(false);
  };

  // Dynamic time calculation: 1.5 mins per set + rest time per set
  const estimatedTime = exercises.reduce((acc, curr) => {
    const setExecutionTime = 0.75; // minutes per set execution (approx 45s)
    const sets = Number(curr.sets) || 0;
    const rest = Number(curr.restTime) || 0;
    const restMins = rest / 60;
    return acc + Math.round(sets * (setExecutionTime + restMins));
  }, 0);

  const handleUpdateExercise = (id: string, field: keyof WorkoutItem, value: string | number) => {
    const updated = exercises.map((ex) => {
      if (ex.id === id) {
        return { ...ex, [field]: value };
      }
      return ex;
    });
    reorderExercises(updated as WorkoutItem[]);
  };

  const handleSaveWorkout = async () => {
    if (exercises.length === 0) return;
    setIsSaving(true);
    setSaveStatus(null);
    
    // Ensure numbers before saving
    const safeExercises = exercises.map(ex => ({
      ...ex,
      sets: Number(ex.sets) || 1,
      restTime: Number(ex.restTime) || 0
    }));

    const result = await saveWorkoutAction(workoutName, safeExercises);
    setIsSaving(false);
    
    if (result.success) {
      setSaveStatus({ success: true, message: "Workout routine saved successfully!" });
      clearWorkout();
      // Reload list if we are in routines tab (or if they switch later)
      fetchRoutines();
    } else {
      setSaveStatus({ success: false, message: result.error || "Failed to save workout." });
    }
  };

  const handleLoadRoutine = (routine: SavedRoutine) => {
    if (exercises.length > 0) {
      const confirmOverwrite = window.confirm(
        "Loading this routine will replace your current active workout. Do you want to proceed?"
      );
      if (!confirmOverwrite) return;
    }

    const loadedExercises: WorkoutItem[] = routine.exercises.map((ex) => ({
      id: `wk-${Date.now()}-${ex.id}`,
      exerciseId: ex.exerciseId,
      name: ex.exerciseName,
      sets: ex.sets,
      reps: ex.reps,
      restTime: ex.restTime,
    }));

    setWorkoutName(routine.name);
    reorderExercises(loadedExercises);
    setActiveTab("builder");
  };

  const handleDeleteRoutine = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this routine permanently?");
    if (!confirmDelete) return;

    const res = await deleteWorkoutAction(id);
    if (res.success) {
      setSavedRoutines(prev => prev.filter(r => r.id !== id));
    } else {
      alert("Failed to delete routine.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 relative z-10">
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 mb-8 gap-6">
        <button
          onClick={() => setActiveTab("builder")}
          className={`pb-4 text-lg font-bold transition-all relative ${
            activeTab === "builder" ? "text-white" : "text-white/40 hover:text-white"
          }`}
        >
          Workout Builder
          {activeTab === "builder" && (
            <motion.div
              layoutId="builder-active-underline"
              className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("routines")}
          className={`pb-4 text-lg font-bold transition-all relative flex items-center gap-2 ${
            activeTab === "routines" ? "text-white" : "text-white/40 hover:text-white"
          }`}
        >
          My Saved Routines
          {savedRoutines.length > 0 && (
            <span className="bg-primary/20 text-primary border border-primary/30 text-xs px-2 py-0.5 rounded-full font-bold">
              {savedRoutines.length}
            </span>
          )}
          {activeTab === "routines" && (
            <motion.div
              layoutId="builder-active-underline"
              className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
              saveStatus.success 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                : "bg-destructive/10 border-destructive/30 text-destructive-foreground"
            }`}
          >
            {saveStatus.message}
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === "builder" ? (
        // Active Builder View
        <div className="space-y-8">
          <div className="space-y-4">
            <input 
              type="text" 
              value={workoutName} 
              onChange={(e) => setWorkoutName(e.target.value)}
              className="text-4xl md:text-5xl font-bold font-heading text-white bg-transparent border-none focus:outline-none focus:ring-0 w-full border-b border-white/10 pb-2 focus:border-primary transition-colors"
              placeholder="Workout Name..."
            />
            <p className="text-white/60">Drag and drop exercises to reorder. Tap inputs to adjust sets, reps, and rest.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Builder Area */}
            <div className="lg:col-span-2">
              <Reorder.Group axis="y" values={exercises} onReorder={reorderExercises} className="space-y-4">
                {exercises.map((ex) => (
                  <Reorder.Item key={ex.id} value={ex} className="relative z-10">
                    <GlassCard className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-grab active:cursor-grabbing p-4 md:p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                      
                      {/* Left: Drag handle + Details */}
                      <div className="flex items-start gap-4 flex-1 w-full">
                        <div className="text-white/40 mt-1 flex-shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                          </svg>
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <h3 className="font-bold text-white text-lg leading-tight">{ex.name}</h3>
                          
                          {/* Dynamic adjustment controls */}
                          <div className="flex flex-wrap gap-4 text-xs">
                            <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md border border-white/5">
                              <span className="text-white/40">Sets:</span>
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={ex.sets}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleUpdateExercise(ex.id, "sets", val === "" ? "" : parseInt(val));
                                }}
                                onBlur={(e) => {
                                  if (!e.target.value || parseInt(e.target.value) < 1) handleUpdateExercise(ex.id, "sets", 1);
                                }}
                                className="bg-transparent text-white font-bold w-8 text-center focus:outline-none focus:text-primary"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md border border-white/5">
                              <span className="text-white/40">Reps:</span>
                              <input
                                type="text"
                                value={ex.reps}
                                onChange={(e) => handleUpdateExercise(ex.id, "reps", e.target.value)}
                                className="bg-transparent text-white font-bold w-12 text-center focus:outline-none focus:text-primary"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md border border-white/5">
                              <span className="text-white/40">Rest:</span>
                              <input
                                type="number"
                                min="0"
                                step="15"
                                value={ex.restTime}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleUpdateExercise(ex.id, "restTime", val === "" ? "" : parseInt(val));
                                }}
                                onBlur={(e) => {
                                  if (!e.target.value) handleUpdateExercise(ex.id, "restTime", 0);
                                }}
                                className="bg-transparent text-white font-bold w-10 text-center focus:outline-none focus:text-primary"
                              />
                              <span className="text-white/30 font-semibold">s</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeExercise(ex.id)}
                        className="text-white/30 hover:text-destructive transition-colors p-2 rounded-lg hover:bg-white/5 align-self-stretch md:align-self-center"
                        aria-label={`Remove ${ex.name}`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>

                    </GlassCard>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              {exercises.length === 0 && (
                <div className="text-center py-16 text-white/40 border border-dashed border-white/10 rounded-2xl bg-white/2">
                  No exercises added. Add them from the Library page!
                </div>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <GlassCard className="sticky top-24 border border-white/10 bg-white/5">
                <h3 className="text-xl font-bold text-white mb-6">Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-white/80">
                    <span className="text-white/60">Total Exercises</span>
                    <span className="font-bold text-white">{exercises.length}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span className="text-white/60">Total Sets</span>
                    <span className="font-bold text-white">
                      {exercises.reduce((acc, curr) => acc + curr.sets, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span className="text-white/60">Est. Time</span>
                    <span className="font-bold text-primary">~{estimatedTime} mins</span>
                  </div>
                </div>
                
                <MagneticButton 
                  intensity={0.2} 
                  onClick={handleSaveWorkout}
                  disabled={isSaving || exercises.length === 0}
                  className="w-full text-center py-4 font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Workout Routine"}
                </MagneticButton>

                {exercises.length > 0 && (
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear all exercises?")) {
                        clearWorkout();
                        setWorkoutName("My Workout");
                      }
                    }}
                    className="w-full mt-3 py-3 text-sm font-semibold text-white/40 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/30"
                  >
                    Clear All Exercises
                  </button>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      ) : (
        // Saved Routines Dashboard
        <div className="space-y-6">
          {isLoadingRoutines ? (
            <div className="text-center py-12 text-white/60 animate-pulse">
              Loading your workout database...
            </div>
          ) : savedRoutines.length === 0 ? (
            <div className="text-center py-16 text-white/40 border border-dashed border-white/10 rounded-2xl bg-white/2">
              You haven't saved any workout routines yet. Create one and click "Save Workout Routine".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedRoutines.map((routine) => {
                const routineSets = routine.exercises.reduce((a: number, c: RoutineExercise) => a + c.sets, 0);
                const routineEstTime = routine.exercises.reduce((a: number, c: RoutineExercise) => {
                  return a + Math.round(c.sets * (0.75 + c.restTime / 60));
                }, 0);

                return (
                  <GlassCard
                    key={routine.id}
                    onClick={() => handleLoadRoutine(routine)}
                    className="border border-white/10 hover:border-primary/30 transition-all p-6 cursor-pointer flex flex-col justify-between h-56 bg-white/5"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-snug">
                          {routine.name}
                        </h3>
                        <button
                          onClick={(e) => handleDeleteRoutine(routine.id, e)}
                          className="text-white/30 hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-white/5"
                          aria-label={`Delete ${routine.name}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex gap-4 text-xs text-white/50">
                        <span>{routine.exercises.length} Exercises</span>
                        <span>•</span>
                        <span>{routineSets} Sets</span>
                        <span>•</span>
                        <span className="text-primary font-semibold">~{routineEstTime} mins</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                      <span className="text-white/35">
                        Saved {new Date(routine.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-primary font-semibold group-hover:underline">
                        Load Routine →
                      </span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

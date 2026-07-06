"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type WorkoutItem = {
  id: string;
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
};

interface WorkoutContextType {
  exercises: WorkoutItem[];
  workoutName: string;
  setWorkoutName: (name: string) => void;
  addExercise: (name: string, exerciseId?: string) => void;
  removeExercise: (id: string) => void;
  reorderExercises: (newOrder: WorkoutItem[]) => void;
  clearWorkout: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<WorkoutItem[]>([]);
  const [workoutName, setWorkoutName] = useState("My Workout");

  const addExercise = (name: string, exerciseId?: string) => {
    const newItem: WorkoutItem = {
      id: `wk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      exerciseId: exerciseId || name,
      name,
      sets: 3,
      reps: "10",
      restTime: 60,
    };
    setExercises((prev) => [...prev, newItem]);
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const reorderExercises = (newOrder: WorkoutItem[]) => {
    setExercises(newOrder);
  };

  const clearWorkout = () => {
    setExercises([]);
  };

  return (
    <WorkoutContext.Provider
      value={{
        exercises,
        workoutName,
        setWorkoutName,
        addExercise,
        removeExercise,
        reorderExercises,
        clearWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within a WorkoutProvider");
  return ctx;
}

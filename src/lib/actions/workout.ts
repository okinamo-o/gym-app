"use server";

import prisma from "@/lib/prisma";

export async function saveWorkoutAction(name: string, exercises: {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
}[]) {
  try {
    const workout = await prisma.workout.create({
      data: {
        name,
        isDraft: false,
        exercises: {
          create: exercises.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.name,
            order: index,
            sets: ex.sets,
            reps: ex.reps,
            restTime: ex.restTime,
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    return { success: true, workout };
  } catch (error) {
    console.error("Failed to save workout:", error);
    return { success: false, error: "Failed to save workout to database." };
  }
}

export async function getSavedWorkouts() {
  try {
    const workouts = await prisma.workout.findMany({
      include: {
        exercises: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, workouts };
  } catch (error) {
    console.error("Failed to fetch saved workouts:", error);
    return { success: false, error: "Failed to fetch saved workouts.", workouts: [] };
  }
}

export async function deleteWorkoutAction(id: string) {
  try {
    await prisma.workout.delete({
      where: {
        id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete workout:", error);
    return { success: false, error: "Failed to delete workout." };
  }
}

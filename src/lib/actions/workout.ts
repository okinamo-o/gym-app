"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function saveWorkoutAction(name: string, exercises: {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
}[]) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "You must be signed in to save workouts." };
    }

    const newWorkout = await prisma.workout.create({
      data: {
        name: name || "My Workout",
        isDraft: false,
        userId: userId,
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

    revalidatePath("/workout-builder");
    return { success: true, workout: newWorkout };
  } catch (error) {
    console.error("Failed to save workout:", error);
    return { success: false, error: "Failed to save workout to database." };
  }
}

export async function getSavedWorkouts() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: true, workouts: [] };
    }

    const workouts = await prisma.workout.findMany({
      where: { userId: userId },
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
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership before deleting
    const workout = await prisma.workout.findUnique({ where: { id } });
    if (!workout || workout.userId !== userId) {
      return { success: false, error: "Unauthorized or not found" };
    }

    await prisma.workout.delete({
      where: {
        id,
      },
    });
    revalidatePath("/workout-builder");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete workout:", error);
    return { success: false, error: "Failed to delete workout." };
  }
}

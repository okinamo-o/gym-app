"use server";

import { getFreeExercises } from "@/lib/api/exercises";

export async function getExercises(query?: string) {
  try {
    const all = await getFreeExercises();
    if (!query) return all.slice(0, 20);

    const lowerQuery = query.toLowerCase();
    return all.filter(ex => 
      ex.name.toLowerCase().includes(lowerQuery) ||
      ex.primaryMuscles.some(m => m.toLowerCase().includes(lowerQuery))
    ).slice(0, 20);
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return [];
  }
}

export async function getExerciseBySlug(slug: string) {
  try {
    const all = await getFreeExercises();
    // In free-exercise-db, the ID acts as the slug.
    return all.find(ex => ex.id === slug) || null;
  } catch (error) {
    console.error("Failed to fetch exercise by slug:", error);
    return null;
  }
}

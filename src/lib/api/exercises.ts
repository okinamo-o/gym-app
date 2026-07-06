export interface FreeExercise {
  id: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

const BASE_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
export const IMAGE_BASE_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

export async function getFreeExercises(): Promise<FreeExercise[]> {
  try {
    const res = await fetch(BASE_URL, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch exercises: ${res.statusText}`);
    }

    const data = await res.json();
    return data as FreeExercise[];
  } catch (error) {
    console.error("Error fetching free-exercise-db:", error);
    return [];
  }
}

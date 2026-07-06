"use server";

import { getFreeExercises, FreeExercise } from "@/lib/api/exercises";

export interface GeneratedExercise {
  id: string; // Unique UI key
  exercise: FreeExercise;
  sets: number;
  reps: string;
  restTime: number;
}

export interface AIWorkoutResult {
  workoutName: string;
  exercises: GeneratedExercise[];
  estimatedTime: number;
}

// Exact muscle distribution quotas per split
const SPLIT_REQUIREMENTS: Record<string, { muscle: string; count: number }[]> = {
  "push": [
    { muscle: "chest", count: 2 },
    { muscle: "shoulders", count: 2 },
    { muscle: "triceps", count: 2 },
  ],
  "pull": [
    { muscle: "lats", count: 2 },
    { muscle: "middle back", count: 2 },
    { muscle: "biceps", count: 2 },
  ],
  "legs": [
    { muscle: "quadriceps", count: 2 },
    { muscle: "hamstrings", count: 2 },
    { muscle: "glutes", count: 1 },
    { muscle: "calves", count: 1 },
  ],
  "upper-body": [
    { muscle: "chest", count: 2 },
    { muscle: "lats", count: 1 },
    { muscle: "middle back", count: 1 },
    { muscle: "shoulders", count: 1 },
    { muscle: "triceps", count: 1 },
    { muscle: "biceps", count: 1 },
  ],
  "lower-body": [
    { muscle: "quadriceps", count: 2 },
    { muscle: "hamstrings", count: 2 },
    { muscle: "glutes", count: 1 },
    { muscle: "calves", count: 1 },
  ],
  "full-body": [
    { muscle: "chest", count: 1 },
    { muscle: "lats", count: 1 },
    { muscle: "quadriceps", count: 1 },
    { muscle: "hamstrings", count: 1 },
    { muscle: "shoulders", count: 1 },
    { muscle: "biceps", count: 1 },
  ]
};

// Helper: heavily penalizes obscure variations, crazy equipment, and very long names
const isFoundational = (ex: FreeExercise) => {
  const name = ex.name.toLowerCase();
  
  // Filter out weird equipment or niche variations
  const badKeywords = [
    "band", "chain", "kettlebell", "bosu", "stability", 
    "leverage", "one arm", "one-arm", "single arm", "single-arm",
    "medicine ball", "smith machine", "suspension", "partner", "neck"
  ];
  
  if (badKeywords.some(keyword => name.includes(keyword))) {
    return false;
  }
  
  // Allow only standard equipment
  const goodEq = ["barbell", "dumbbell", "cable", "machine", "body only", "e-z curl bar", "none"];
  if (ex.equipment && !goodEq.includes(ex.equipment.toLowerCase())) {
    return false;
  }

  // If the name is ridiculously long, it's usually a weird variation
  if (name.length > 35) return false;

  return true;
};

// Tier 1 Compound Movements that should form the base of any workout
const TIER_1_KEYWORDS = [
  "bench press", "squat", "deadlift", "pull up", "chin up", "pull-up", "chin-up",
  "barbell row", "cable row", "lat pulldown", "shoulder press", "overhead press",
  "leg press", "hack squat", "romanian deadlift", "dips"
];

const isTier1 = (ex: FreeExercise) => {
  const name = ex.name.toLowerCase();
  return TIER_1_KEYWORDS.some(k => name.includes(k)) && isFoundational(ex);
};

export async function generateWorkout(split: string, experienceLevel: string, volume: string = "standard"): Promise<AIWorkoutResult | null> {
  try {
    const allExercises = await getFreeExercises();
    if (!allExercises || allExercises.length === 0) return null;

    // 1. Filter by Experience Level
    let suitable = allExercises;
    if (experienceLevel === "beginner") {
      suitable = allExercises.filter(ex => ex.level.toLowerCase() === "beginner");
    } else if (experienceLevel === "intermediate") {
      suitable = allExercises.filter(ex => ["beginner", "intermediate"].includes(ex.level.toLowerCase()));
    }

    if (suitable.length === 0) suitable = allExercises; // Fallback

    // 2. Separate into foundational (preferred) and obscure (fallback)
    let foundational = suitable.filter(isFoundational);
    
    // Quick split-specific exclusions
    if (split === "push") {
      suitable = suitable.filter(ex => !ex.name.toLowerCase().includes("reverse fly") && !ex.name.toLowerCase().includes("pull"));
      foundational = foundational.filter(ex => !ex.name.toLowerCase().includes("reverse fly") && !ex.name.toLowerCase().includes("pull"));
    } else if (split === "pull") {
      suitable = suitable.filter(ex => !ex.name.toLowerCase().includes("press") && !ex.name.toLowerCase().includes("push"));
      foundational = foundational.filter(ex => !ex.name.toLowerCase().includes("press") && !ex.name.toLowerCase().includes("push"));
    }

    const baseReqs = SPLIT_REQUIREMENTS[split] || SPLIT_REQUIREMENTS["full-body"];
    
    // Apply Volume Scaling
    const reqs = baseReqs.map(req => {
      if (volume === "short") {
        return { ...req, count: 1 };
      } else if (volume === "long") {
        return { ...req, count: req.count + 1 };
      }
      return req;
    });

    const selected: FreeExercise[] = [];
    const usedIds = new Set<string>();

    // 3. Fulfill exact muscle quotas
    for (const req of reqs) {
      let countFilled = 0;

      // A) Try to find a Tier 1 Compound for the very first slot of this muscle group
      const tier1Candidates = foundational.filter(ex => 
        isTier1(ex) && !usedIds.has(ex.id) && ex.primaryMuscles.map(m => m.toLowerCase()).includes(req.muscle)
      ).sort(() => 0.5 - Math.random());

      if (tier1Candidates.length > 0 && countFilled < req.count) {
        selected.push(tier1Candidates[0]);
        usedIds.add(tier1Candidates[0].id);
        countFilled++;
      }

      // B) Fill the remaining quota with normal foundational exercises (accessories)
      const foundationCandidates = foundational.filter(ex => 
        !usedIds.has(ex.id) && ex.primaryMuscles.map(m => m.toLowerCase()).includes(req.muscle)
      ).sort(() => 0.5 - Math.random());

      for (const ex of foundationCandidates) {
        if (countFilled >= req.count) break;
        selected.push(ex);
        usedIds.add(ex.id);
        countFilled++;
      }

      // C) If we didn't fill the quota with foundational exercises, fallback to the rest
      if (countFilled < req.count) {
        const fallbackCandidates = suitable.filter(ex => 
          !usedIds.has(ex.id) && ex.primaryMuscles.map(m => m.toLowerCase()).includes(req.muscle)
        ).sort(() => 0.5 - Math.random());

        for (const ex of fallbackCandidates) {
          if (countFilled >= req.count) break;
          selected.push(ex);
          usedIds.add(ex.id);
          countFilled++;
        }
      }
    }

    // Map to GeneratedExercise with sets/reps
    const routine = selected.map((ex, index) => ({
      id: `ai-gen-${Date.now()}-${index}`,
      exercise: ex,
      sets: 3,
      reps: "10-12",
      restTime: 60
    }));

    return {
      workoutName: `AI Generated ${split.replace("-", " ").toUpperCase()} Day`,
      exercises: routine,
      estimatedTime: routine.length * 10
    };

  } catch (error) {
    console.error("Failed to generate visual AI workout:", error);
    return null;
  }
}

export async function getAlternativeExercise(currentExerciseId: string, currentExerciseMuscles: string[], avoidIds: string[]): Promise<FreeExercise | null> {
  try {
    const allExercises = await getFreeExercises();
    
    // Find alternatives that target AT LEAST ONE of the same primary muscles, 
    // are NOT the current exercise, and are NOT already in the workout (avoidIds).
    const alternatives = allExercises.filter(ex => 
      ex.id !== currentExerciseId &&
      !avoidIds.includes(ex.id) &&
      ex.primaryMuscles.some(m => currentExerciseMuscles.map(cm => cm.toLowerCase()).includes(m.toLowerCase()))
    );

    if (alternatives.length === 0) return null;

    // Prioritize foundational exercises for alternatives too
    const foundational = alternatives.filter(isFoundational);
    if (foundational.length > 0) {
      return foundational[Math.floor(Math.random() * foundational.length)];
    }

    // Fallback to obscure if no foundational available
    return alternatives[Math.floor(Math.random() * alternatives.length)];
  } catch (error) {
    console.error("Failed to find alternative:", error);
    return null;
  }
}

export async function getInjurySafeSubstitution(exerciseId: string, injuryType: string) {
  try {
    const allExercises = await getFreeExercises();
    const original = allExercises.find(ex => ex.id === exerciseId);

    if (!original) return null;

    const alternatives = allExercises.filter(ex => 
      ex.id !== exerciseId && 
      ex.primaryMuscles.some(m => original.primaryMuscles.includes(m))
    ).slice(0, 3);

    return alternatives.map(alt => ({
      ...alt,
      aiReasoning: `Because you have a ${injuryType} injury, ${alt.name} may be a viable alternative targeting similar muscle groups.`
    }));

  } catch (error) {
    console.error("Failed to find substitution:", error);
    return [];
  }
}

export async function getMultipleAlternativeExercises(currentExerciseId: string, currentExerciseMuscles: string[], avoidIds: string[], count: number = 3): Promise<FreeExercise[]> {
  try {
    const allExercises = await getFreeExercises();
    
    // Find alternatives that target AT LEAST ONE of the same primary muscles, 
    // are NOT the current exercise, and are NOT already in the workout (avoidIds).
    const alternatives = allExercises.filter(ex => 
      ex.id !== currentExerciseId &&
      !avoidIds.includes(ex.id) &&
      ex.primaryMuscles.some(m => currentExerciseMuscles.map(cm => cm.toLowerCase()).includes(m.toLowerCase()))
    );

    if (alternatives.length === 0) return [];

    // Prioritize foundational exercises for alternatives too
    const foundational = alternatives.filter(isFoundational).sort(() => 0.5 - Math.random());
    const obscure = alternatives.filter(ex => !isFoundational(ex)).sort(() => 0.5 - Math.random());
    
    const selected = [...foundational, ...obscure].slice(0, count);
    
    return selected;
  } catch (error) {
    console.error("Failed to find multiple alternatives:", error);
    return [];
  }
}

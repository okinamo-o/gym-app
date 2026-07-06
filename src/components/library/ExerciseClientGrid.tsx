"use client";

import { useState, useMemo } from "react";
import { FreeExercise } from "@/lib/api/exercises";
import { FilterBar } from "./FilterBar";
import { ExerciseCard } from "./ExerciseCard";
import { ExerciseDetailModal } from "./ExerciseDetailModal";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

interface ExerciseClientGridProps {
  initialExercises: FreeExercise[];
}

export function ExerciseClientGrid({ initialExercises }: ExerciseClientGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  
  const [selectedExercise, setSelectedExercise] = useState<FreeExercise | null>(null);
  
  // #10: Pagination limit
  const [visibleCount, setVisibleCount] = useState(24);

  // Normalize function for consistent capitalization
  const normalize = (str: string) => {
    if (!str) return "";
    const clean = str.trim().toLowerCase();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  // Extract unique filters
  const uniqueMuscles = useMemo(() => {
    const muscles = new Set<string>();
    initialExercises.forEach(ex => ex.primaryMuscles.forEach(m => muscles.add(normalize(m))));
    return Array.from(muscles).sort();
  }, [initialExercises]);

  const uniqueEquipment = useMemo(() => {
    const equipment = new Set<string>();
    initialExercises.forEach(ex => { if (ex.equipment) equipment.add(normalize(ex.equipment)) });
    return Array.from(equipment).sort();
  }, [initialExercises]);

  const uniqueLevels = useMemo(() => {
    const levels = new Set<string>();
    initialExercises.forEach(ex => levels.add(normalize(ex.level)));
    return Array.from(levels).sort();
  }, [initialExercises]);

  // Filtering Logic
  const filteredExercises = useMemo(() => {
    // Reset page view count when filters change to avoid showing empty states
    return initialExercises.filter((ex) => {
      const matchSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const exMuscles = ex.primaryMuscles.map(normalize);
      const matchMuscle = selectedMuscle === "All" || exMuscles.includes(selectedMuscle);
      
      const matchEquipment = selectedEquipment === "All" || normalize(ex.equipment || "") === selectedEquipment;
      const matchLevel = selectedLevel === "All" || normalize(ex.level) === selectedLevel;
      
      return matchSearch && matchMuscle && matchEquipment && matchLevel;
    });
  }, [initialExercises, searchQuery, selectedMuscle, selectedEquipment, selectedLevel]);

  // Dynamic reset of visible count when filters change
  useMemo(() => {
    setVisibleCount(24);
  }, [searchQuery, selectedMuscle, selectedEquipment, selectedLevel]);

  const visibleExercises = useMemo(() => {
    return filteredExercises.slice(0, visibleCount);
  }, [filteredExercises, visibleCount]);

  const hasMore = filteredExercises.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 24);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-12 relative z-10">
      
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">Complete Library</h1>
          <p className="text-white/60">Browse {initialExercises.length}+ exercises from the open database.</p>
        </div>
        
        {/* #9: Dynamic results count badge */}
        <div className="self-start md:self-end bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-md">
          Showing <span className="text-primary font-bold">{filteredExercises.length}</span> of {initialExercises.length} exercises
        </div>
      </div>

      <FilterBar 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        selectedMuscle={selectedMuscle} setSelectedMuscle={setSelectedMuscle}
        selectedEquipment={selectedEquipment} setSelectedEquipment={setSelectedEquipment}
        selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel}
        uniqueMuscles={uniqueMuscles} uniqueEquipment={uniqueEquipment} uniqueLevels={uniqueLevels}
      />

      <motion.div layout className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {visibleExercises.map((ex) => (
            <motion.div
              key={ex.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ExerciseCard exercise={ex} onClick={setSelectedExercise} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredExercises.length === 0 && (
          <div className="col-span-full py-24 text-center text-white/40">
            No exercises match your exact filters.
          </div>
        )}
      </motion.div>

      {/* #10: Load More Trigger */}
      {hasMore && (
        <div className="mt-12 text-center">
          <MagneticButton
            intensity={0.1}
            onClick={handleLoadMore}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10"
          >
            Load More Exercises
          </MagneticButton>
        </div>
      )}

      <ExerciseDetailModal 
        exercise={selectedExercise} 
        onClose={() => setSelectedExercise(null)} 
      />
    </div>
  );
}

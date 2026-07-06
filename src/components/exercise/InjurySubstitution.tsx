"use client";

import { useState } from "react";
import { getInjurySafeSubstitution } from "@/lib/actions/ai";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function InjurySubstitution({ exerciseId, exerciseName }: { exerciseId: string; exerciseName: string }) {
  const [injury, setInjury] = useState("Lower Back");
  const [isLoading, setIsLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<any[] | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    const results = await getInjurySafeSubstitution(exerciseId, injury);
    setAlternatives(results);
    setIsLoading(false);
  };

  return (
    <GlassCard className="mt-8 border-primary/20 bg-primary/5">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-bold font-heading text-white">AI Injury Safeguard</h3>
      </div>
      
      <p className="text-white/60 mb-6 text-sm">
        Does {exerciseName} aggravate an existing injury? Select the affected area to get safe, biomechanically similar alternatives.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <select 
          value={injury}
          onChange={(e) => setInjury(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary flex-1 backdrop-blur-md appearance-none"
        >
          <option value="Lower Back">Lower Back</option>
          <option value="Knee">Knee / Patella</option>
          <option value="Shoulder">Shoulder / Rotator Cuff</option>
          <option value="Wrist">Wrist</option>
          <option value="Elbow">Elbow</option>
        </select>
        <MagneticButton intensity={0.1} onClick={handleSearch} disabled={isLoading} className="sm:w-auto w-full px-8">
          {isLoading ? "Analyzing..." : "Find Alternatives"}
        </MagneticButton>
      </div>

      <AnimatePresence>
        {alternatives && alternatives.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {alternatives.map((alt) => (
              <div key={alt.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="font-bold text-white mb-2">{alt.name}</h4>
                <p className="text-sm text-primary/80">{alt.aiReasoning}</p>
              </div>
            ))}
          </motion.div>
        )}
        
        {alternatives && alternatives.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 text-sm"
          >
            No direct alternatives found for this specific movement pattern.
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

const splits = [
  {
    id: "push",
    name: "Push Day",
    description: "Chest, Shoulders, and Triceps. Focus on pressing movements and building upper body mass.",
    color: "from-blue-500/20 to-transparent",
    hoverColor: "group-hover:from-blue-500/40",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: "pull",
    name: "Pull Day",
    description: "Back, Biceps, and Rear Delts. Build a wide back and thick arms with heavy pulling.",
    color: "from-purple-500/20 to-transparent",
    hoverColor: "group-hover:from-purple-500/40",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: "legs",
    name: "Leg Day",
    description: "Quads, Hamstrings, and Calves. The foundation of true strength and athletic power.",
    color: "from-emerald-500/20 to-transparent",
    hoverColor: "group-hover:from-emerald-500/40",
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1474&auto=format&fit=crop",
  },
];

export function QuickStartSplits() {
  return (
    <section className="py-24 px-4 w-full max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold font-heading text-white mb-4"
        >
          Quick-Start Splits
        </motion.h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Jump straight into the AI Workout Architect with a pre-configured training split.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {splits.map((split, idx) => (
          <Link key={split.id} href={`/ai`} className="block group">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="h-full"
            >
              <GlassCard className="h-full overflow-hidden border-white/10 p-0 relative">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${split.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${split.color} ${split.hoverColor} transition-colors duration-500`} />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                
                <div className="relative z-10 p-8 h-full flex flex-col justify-end min-h-[300px]">
                  <h3 className="text-3xl font-bold font-heading text-white mb-2 group-hover:text-primary transition-colors">
                    {split.name}
                  </h3>
                  <p className="text-white/80 line-clamp-2">
                    {split.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-white font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Generate Routine 
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

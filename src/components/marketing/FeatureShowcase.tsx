"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";

const features = [
  {
    title: "AI Coach Engine",
    description: "Our intelligence engine doesn't just pick random exercises. It builds mathematically sound routines anchored by Tier-1 heavy compound movements, tailored to your exact experience level.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "870+ Exercise Library",
    description: "Explore a massive, categorized database of over 870 exercises. Filter by target muscle, equipment required, or mechanics to find the perfect movement for your goals.",
    icon: (
      <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    title: "Smart Substitution",
    description: "Don't like an exercise? One click opens a beautiful choice modal showing the top 3 alternative movements that target the exact same muscle group. You're always in control.",
    icon: (
      <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-24 px-4 w-full max-w-7xl mx-auto relative">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 blur-[100px] rounded-full -z-10" />

      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold font-heading text-white mb-4"
        >
          Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Results.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-white/60 max-w-2xl mx-auto"
        >
          Everything you need to break plateaus and engineer the perfect physique, powered by next-generation algorithms.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
          >
            <GlassCard className="h-full p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative z-10">
                <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block border border-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold font-heading text-white mb-4">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

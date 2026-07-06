"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-6 max-w-4xl px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 backdrop-blur-md mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          The Next-Generation Fitness Platform
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-heading">
          Think Less. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Lift More.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          The ultimate premium exercise tracker built for serious strength training. 
          Discover over 870 exercises, track your progress, and break your plateaus.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/library">
            <MagneticButton intensity={0.3} className="px-8 py-6 text-lg">
              Explore Library
            </MagneticButton>
          </Link>
          <Link href="/ai">
            <MagneticButton intensity={0.1} className="px-8 py-6 text-lg bg-white/10 text-white hover:bg-white/20 border border-white/10">
              AI Workout Architect
            </MagneticButton>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

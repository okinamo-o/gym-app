"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function CallToAction() {
  return (
    <section className="relative w-full py-32 overflow-hidden mt-12">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10" />
      
      {/* Light Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full opacity-50" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-bold font-heading text-white mb-6"
        >
          Stop Guessing. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
            Start Building.
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-white/60 mb-10 max-w-2xl mx-auto"
        >
          Join the next generation of strength training. Generate a mathematically perfect routine in seconds, or browse our massive library of 870+ exercises.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/workout-builder">
            <MagneticButton intensity={0.3} className="px-10 py-6 text-xl font-bold rounded-full shadow-[0_0_40px_rgba(var(--primary),0.4)]">
              Build Your Routine
            </MagneticButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

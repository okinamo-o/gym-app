"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MuscleGroup {
  id: string;
  label: string;
  d: string;
  side: "front" | "back";
  cx: number; // center point X
  cy: number; // center point Y
  lx: number; // label line end point X
  ly: number; // label line end point Y
  align: "left" | "right";
}

const musclePaths: MuscleGroup[] = [
  // Front View
  { 
    id: "chest", 
    label: "Chest", 
    d: "M 80 80 Q 100 65 120 80 Q 100 105 80 80 Z",
    side: "front",
    cx: 100, cy: 85,
    lx: 25, ly: 85,
    align: "left"
  },
  { 
    id: "abdominals", 
    label: "Abs", 
    d: "M 85 110 L 115 110 L 110 155 L 90 155 Z",
    side: "front",
    cx: 100, cy: 130,
    lx: 25, ly: 130,
    align: "left"
  },
  { 
    id: "shoulders", 
    label: "Shoulders", 
    d: "M 72 72 Q 55 65 48 85 Q 65 88 72 72 Z M 128 72 Q 145 65 152 85 Q 135 88 128 72 Z",
    side: "front",
    cx: 58, cy: 78,
    lx: 25, ly: 50,
    align: "left"
  },
  { 
    id: "quadriceps", 
    label: "Quads", 
    d: "M 70 185 Q 58 225 68 280 Q 88 280 92 185 Z M 130 185 Q 142 225 132 280 Q 112 280 108 185 Z",
    side: "front",
    cx: 80, cy: 230,
    lx: 25, ly: 230,
    align: "left"
  },
  { 
    id: "biceps", 
    label: "Biceps", 
    d: "M 52 92 Q 42 120 48 135 L 56 130 Q 52 110 56 95 Z M 148 92 Q 158 120 152 135 L 144 130 Q 148 110 144 95 Z",
    side: "front",
    cx: 150, cy: 110,
    lx: 175, ly: 110,
    align: "right"
  },
  { 
    id: "forearms", 
    label: "Forearms", 
    d: "M 46 142 Q 35 170 42 195 L 50 190 Q 45 165 52 145 Z M 154 142 Q 165 170 158 195 L 150 190 Q 155 165 148 145 Z",
    side: "front",
    cx: 156, cy: 165,
    lx: 175, ly: 165,
    align: "right"
  },

  // Back View
  { 
    id: "lats", 
    label: "Lats / Back", 
    d: "M 65 75 Q 100 55 135 75 L 120 145 L 80 145 Z",
    side: "back",
    cx: 100, cy: 105,
    lx: 25, ly: 105,
    align: "left"
  },
  { 
    id: "hamstrings", 
    label: "Hamstrings", 
    d: "M 70 185 Q 60 230 70 280 Q 90 280 92 185 Z M 130 185 Q 140 230 130 280 Q 110 280 108 185 Z",
    side: "back",
    cx: 80, cy: 230,
    lx: 25, ly: 230,
    align: "left"
  },
  { 
    id: "calves", 
    label: "Calves", 
    d: "M 70 290 Q 60 325 74 365 Q 85 365 88 290 Z M 130 290 Q 140 325 126 365 Q 115 365 112 290 Z",
    side: "back",
    cx: 79, cy: 325,
    lx: 25, ly: 325,
    align: "left"
  },
  { 
    id: "triceps", 
    label: "Triceps", 
    d: "M 52 92 Q 40 120 46 135 L 54 130 Q 48 110 54 95 Z M 148 92 Q 160 120 154 135 L 146 130 Q 152 110 146 95 Z",
    side: "back",
    cx: 150, cy: 110,
    lx: 175, ly: 110,
    align: "right"
  },
  { 
    id: "glutes", 
    label: "Glutes", 
    d: "M 75 150 L 125 150 Q 130 178 100 180 Q 70 178 75 150 Z",
    side: "back",
    cx: 100, cy: 165,
    lx: 175, ly: 165,
    align: "right"
  }
];

export function AnatomyViewer({ onSelectMuscle }: { onSelectMuscle?: (muscle: string | null) => void }) {
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    const newSelected = selected === id ? null : id;
    setSelected(newSelected);
    if (onSelectMuscle) onSelectMuscle(newSelected);
  };

  const visiblePaths = musclePaths.filter((m) => m.side === activeSide);

  return (
    <div className="relative w-full max-w-[420px] mx-auto aspect-[3/4] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col p-6 overflow-hidden">
      
      {/* View Toggle */}
      <div className="flex items-center justify-between z-10 bg-black/40 rounded-full p-1 border border-white/10 mb-6">
        <button
          onClick={() => {
            setActiveSide("front");
            setSelected(null);
            if (onSelectMuscle) onSelectMuscle(null);
          }}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
            activeSide === "front" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"
          )}
        >
          Anterior (Front)
        </button>
        <button
          onClick={() => {
            setActiveSide("back");
            setSelected(null);
            if (onSelectMuscle) onSelectMuscle(null);
          }}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
            activeSide === "back" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"
          )}
        >
          Posterior (Back)
        </button>
      </div>

      <div className="relative flex-1 w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full drop-shadow-2xl">
          {/* Head */}
          <circle cx="100" cy="30" r="14" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="2" />
          {/* Neck */}
          <path d="M 94 44 L 94 52 L 106 52 L 106 44 Z" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="2" />
          {/* Body Outline */}
          <path d="M 60 70 Q 100 52 140 70 L 140 150 L 122 182 L 120 380 Q 110 390 100 380 Q 90 390 80 380 L 78 182 L 60 150 Z" 
                fill="none" stroke="currentColor" className="text-white/10" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Lines & Labels */}
          {visiblePaths.map((muscle) => {
            const isHovered = hovered === muscle.id;
            const isSelected = selected === muscle.id;
            const textAnchor = muscle.align === "left" ? "end" : "start";

            return (
              <g key={`lbl-${muscle.id}`} className="pointer-events-none">
                {/* Pointer Line */}
                <motion.path
                  d={`M ${muscle.cx} ${muscle.cy} L ${muscle.lx} ${muscle.ly}`}
                  fill="none"
                  stroke={isSelected ? "#00f0ff" : isHovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)"}
                  strokeWidth="1.5"
                  strokeDasharray="2,2"
                  animate={{ opacity: isSelected || isHovered ? 1 : 0.6 }}
                />
                
                {/* Label Text */}
                <motion.text
                  x={muscle.align === "left" ? muscle.lx - 5 : muscle.lx + 5}
                  y={muscle.ly + 4}
                  textAnchor={textAnchor}
                  fill={isSelected ? "#00f0ff" : isHovered ? "#ffffff" : "rgba(255,255,255,0.4)"}
                  className="text-[10px] font-bold tracking-wider uppercase font-sans font-medium"
                  animate={{ 
                    scale: isSelected || isHovered ? 1.05 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {muscle.label}
                </motion.text>
              </g>
            );
          })}

          {/* Muscle Paths (Interactive Zones) */}
          {visiblePaths.map((muscle) => {
            const isHovered = hovered === muscle.id;
            const isSelected = selected === muscle.id;
            
            return (
              <g key={muscle.id} 
                 onMouseEnter={() => setHovered(muscle.id)}
                 onMouseLeave={() => setHovered(null)}
                 onClick={() => handleSelect(muscle.id)}
                 className="cursor-pointer outline-none"
              >
                <motion.path
                  d={muscle.d}
                  initial={{ fillOpacity: 0.05 }}
                  animate={{ 
                    fillOpacity: isSelected ? 0.6 : isHovered ? 0.3 : 0.08,
                    strokeOpacity: isSelected || isHovered ? 1 : 0.3
                  }}
                  className={cn(
                    "transition-all duration-300",
                    isSelected 
                      ? "fill-primary stroke-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" 
                      : "fill-white/20 stroke-white/40 hover:stroke-white hover:fill-white/40"
                  )}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

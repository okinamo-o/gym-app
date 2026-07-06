"use client";

import { Dispatch, SetStateAction } from "react";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedMuscle: string;
  setSelectedMuscle: Dispatch<SetStateAction<string>>;
  selectedEquipment: string;
  setSelectedEquipment: Dispatch<SetStateAction<string>>;
  selectedLevel: string;
  setSelectedLevel: Dispatch<SetStateAction<string>>;
  uniqueMuscles: string[];
  uniqueEquipment: string[];
  uniqueLevels: string[];
}

export function FilterBar({
  searchQuery, setSearchQuery,
  selectedMuscle, setSelectedMuscle,
  selectedEquipment, setSelectedEquipment,
  selectedLevel, setSelectedLevel,
  uniqueMuscles, uniqueEquipment, uniqueLevels
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search 870+ exercises..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all backdrop-blur-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Muscle Select */}
        <div className="relative">
          <select
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md capitalize cursor-pointer hover:border-white/20 transition-colors"
          >
            <option value="All">All Muscles</option>
            {uniqueMuscles.map(m => (
              <option key={m} value={m} className="bg-[#0B0F19]">{m}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-white/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Equipment Select */}
        <div className="relative">
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md capitalize cursor-pointer hover:border-white/20 transition-colors"
          >
            <option value="All">All Equipment</option>
            {uniqueEquipment.map(e => (
              <option key={e} value={e} className="bg-[#0B0F19]">{e}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-white/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Level Select */}
        <div className="relative">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md capitalize cursor-pointer hover:border-white/20 transition-colors"
          >
            <option value="All">All Levels</option>
            {uniqueLevels.map(l => (
              <option key={l} value={l} className="bg-[#0B0F19]">{l}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-white/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

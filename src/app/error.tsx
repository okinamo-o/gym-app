"use client";

import { useEffect } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GlassCard } from "@/components/ui/glass-card";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-8 text-center bg-black/40 border-destructive/30">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold font-heading text-white mb-3">
          Something went wrong
        </h2>
        
        <p className="text-white/60 mb-8 text-sm">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>

        <MagneticButton 
          onClick={() => reset()}
          className="w-full py-3"
          intensity={0.1}
        >
          Try Again
        </MagneticButton>
      </GlassCard>
    </div>
  );
}

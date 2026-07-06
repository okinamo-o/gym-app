"use client";

import { useEffect } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${inter.className} ${outfit.className} dark`}>
      <body className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold font-heading text-white mb-3">
            Critical System Error
          </h2>
          
          <p className="text-white/60 mb-8 text-sm">
            We encountered a fatal error that crashed the application. Please refresh the page or try again.
          </p>

          <MagneticButton 
            onClick={() => reset()}
            className="w-full py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
            intensity={0.1}
          >
            Try Again
          </MagneticButton>
        </div>
      </body>
    </html>
  );
}

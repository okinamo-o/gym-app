import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { WorkoutProvider } from "@/lib/context/WorkoutContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lyfta Next-Gen | Exercise & Workout Tracker",
  description: "The ultimate premium fitness tracking application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <WorkoutProvider>
          <Header />
          {children}
        </WorkoutProvider>
      </body>
    </html>
  );
}

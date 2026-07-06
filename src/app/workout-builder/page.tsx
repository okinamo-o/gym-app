import { WorkoutBuilder } from "@/components/workout/WorkoutBuilder";

export const metadata = {
  title: "Workout Builder | Lyfta Next-Gen",
};

export default function WorkoutBuilderPage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <WorkoutBuilder />
    </main>
  );
}

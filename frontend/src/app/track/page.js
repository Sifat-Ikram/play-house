import TrackContent from "@/components/pages/track/TrackContent";

export const metadata = {
  title: "Track Order | Play House",
  description: "Track your Play House order status.",
};

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      <TrackContent />
    </main>
  );
}

import AIAssistantContent from "@/components/pages/aiAssistant/AIAssistantContent";

export const metadata = {
  title: "AI Toy Assistant | Play House",
  description:
    "Tell our AI assistant what you're looking for and get personalized toy recommendations.",
};

export default function AIAssistantPage() {
  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      <AIAssistantContent />
    </main>
  );
}

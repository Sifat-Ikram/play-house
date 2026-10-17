import AIAssistantContent from "@/components/pages/aiAssistant/AIAssistantContent";

export const metadata = {
  title: "AI Toy Assistant | Play House",
  description:
    "Tell our AI assistant what you're looking for and get personalized toy recommendations.",
};

const API_URL = "https://play-house-backend.vercel.app/api";

// 5 min cache, ISR style
const getFeaturedProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/product`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const json = await res.json();
    const list = Array.isArray(json) ? json : json.data || json.products || [];
    return list.slice(0, 5);
  } catch (error) {
    return [];
  }
};

export default async function AIAssistantPage() {
  const initialProducts = await getFeaturedProducts();

  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      <AIAssistantContent initialProducts={initialProducts} />
    </main>
  );
}

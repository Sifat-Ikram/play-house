import StaticPage from "@/components/pages/static/StaticPage";

export const metadata = {
  title: "FAQs | Play House",
  description: "Answers to common questions about ordering from Play House.",
};

const FAQS = [
  [
    "Do I need an account to order?",
    "No. You can check out as a guest. An account lets you save addresses, see your orders and write reviews.",
  ],
  [
    "How do I track my order?",
    "Open the Track Order page and enter your order number and phone number. Logged-in users see all their orders there.",
  ],
  [
    "Which payment methods do you accept?",
    "Cash on Delivery at the moment. Card payments are coming soon.",
  ],
  ["How long does delivery take?", "Usually 3-5 business days."],
  [
    "Can I return a toy?",
    "Yes, within 7 days of delivery if it is damaged, wrong or not as described.",
  ],
  [
    "What is the wholesale price?",
    "Selected toys have a lower per-unit price when you buy the minimum bulk quantity. Browse them from the Wholesale link.",
  ],
  [
    "I forgot my password.",
    "Use 'Forgot password?' on the login page and we'll email you a reset link.",
  ],
  [
    "Can I get notified when a toy is back in stock?",
    "Yes. Log in and press 'Notify me when back in stock' on the product page.",
  ],
];

export default function Page() {
  return (
    <StaticPage eyebrow="Help" title="Frequently Asked Questions">
      <div className="divide-y" style={{ borderColor: "var(--ph-border)" }}>
        {FAQS.map(([q, a]) => (
          <details key={q} className="py-3.5">
            <summary className="cursor-pointer text-sm font-bold text-[var(--ph-text)]">
              {q}
            </summary>
            <p className="mt-2">{a}</p>
          </details>
        ))}
      </div>
    </StaticPage>
  );
}

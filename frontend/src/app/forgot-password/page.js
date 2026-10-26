import ForgotPasswordContent from "@/components/pages/auth/ForgotPasswordContent";

export const metadata = { title: "Forgot Password | Play House" };

export default function ForgotPasswordPage() {
  return (
    <main className="bg-[var(--ph-bg)]">
      <ForgotPasswordContent />
    </main>
  );
}

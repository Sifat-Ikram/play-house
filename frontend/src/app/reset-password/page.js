import { Suspense } from "react";
import ResetPasswordContent from "@/components/pages/auth/ResetPasswordContent";

export const metadata = { title: "Reset Password | Play House" };

export default function ResetPasswordPage() {
  return (
    <main className="bg-[var(--ph-bg)]">
      <Suspense fallback={null}>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}

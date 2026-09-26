import ProfileContent from "@/components/pages/profile/ProfileContent";
import { getProfileFromServer } from "@/lib/serverFetch";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getProfileFromServer();

  return (
    <main className="min-h-screen bg-[var(--ph-bg)]">
      <ProfileContent initialProfile={profile} />
    </main>
  );
}

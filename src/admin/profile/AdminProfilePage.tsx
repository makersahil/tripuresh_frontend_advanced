// src/admin/profile/AdminProfilePage.tsx
import { useEffect, useState } from "react";
import ProfileForm from "./ProfileForm";
import { fetchProfile, updateProfile, type ProfilePayload } from "./api";

export default function AdminProfilePage() {
  const [row, setRow] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setBusy(true);
        const data = await fetchProfile();
        if (active) setRow(data);
      } catch (e: any) {
        if (active) setErr(e?.response?.data?.message || e?.message || "Failed to load profile");
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => { active = false; };
  }, []);

  async function handleSave(payload: ProfilePayload) {
    setErr(null); setSaved(null);
    await updateProfile(payload);
    setSaved("Profile saved.");
    // Optionally refetch
    const data = await fetchProfile();
    setRow(data);
  }

  return (
    <section className="container py-8">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">Edit Dr. Joshi’s public profile.</p>
        {busy && <div className="text-xs text-muted-foreground mt-1">Loading…</div>}
        {err && <div className="mt-2 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{err}</div>}
        {saved && <div className="mt-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">{saved}</div>}
      </div>

      <ProfileForm
        initial={row ?? undefined}
        onSave={handleSave}
        onCancel={() => window.history.back()}
      />
    </section>
  );
}

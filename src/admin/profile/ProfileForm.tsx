// src/admin/profile/ProfileForm.tsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import type { ProfilePayload } from "./api";

type ProfileInitial = {
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  contactEmail?: string;
  phone?: string;
  socials?: Record<string, unknown> | null;
  published?: boolean;
};

export default function ProfileForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ProfileInitial | null;
  onSave: (data: ProfilePayload) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? "");
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [socialsText, setSocialsText] = useState(
    initial?.socials ? JSON.stringify(initial.socials, null, 2) : ""
  );
  const [published, setPublished] = useState<boolean>(initial?.published ?? true);

  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!initial) return;
    setName(initial.name ?? "");
    setTitle(initial.title ?? "");
    setBio(initial.bio ?? "");
    setAvatarUrl(initial.avatarUrl ?? "");
    setContactEmail(initial.contactEmail ?? "");
    setPhone(initial.phone ?? "");
    setSocialsText(initial.socials ? JSON.stringify(initial.socials, null, 2) : "");
    setPublished(initial.published ?? true);
  }, [initial?.name, initial?.title, initial?.bio]);

  const canSubmit = useMemo(() => {
    return Boolean(name.trim()) && Boolean(title.trim()) && Boolean(bio.trim());
  }, [name, title, bio]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!canSubmit) {
      setErr("Please fill all required fields (Name, Title, Bio).");
      return;
    }

    // Parse socials JSON if present
    let socials: Record<string, unknown> | null | undefined = undefined;
    if (socialsText.trim()) {
      try {
        const parsed = JSON.parse(socialsText);
        if (parsed && typeof parsed === "object") socials = parsed as Record<string, unknown>;
        else socials = null;
      } catch (e: any) {
        setErr("Socials must be valid JSON (e.g. { \"twitter\": \"@handle\" }).");
        return;
      }
    } else {
      socials = undefined; // omit if empty
    }

    const payload: ProfilePayload = {
      name: name.trim(),
      title: title.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      phone: phone.trim() || undefined,
      socials,
      published,
    };

    try {
      setBusy(true);
      await onSave(payload);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to update profile");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
      {/* Main form */}
      <div className="md:col-span-2 grid gap-4">
        {err && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {err}
          </div>
        )}

        <label className="grid gap-1">
          <span className="text-sm font-medium">Name *</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Title *</span>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Bio *</span>
          <textarea
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm"
            rows={8}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Avatar URL</span>
            <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Contact Email</span>
            <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Phone</span>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="inline-flex items-center gap-2 mt-6 select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span className="text-sm">Published</span>
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Socials (JSON)</span>
          <textarea
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm font-mono"
            rows={6}
            placeholder={`{ "twitter": "tripuresh", "linkedin": "…" }`}
            value={socialsText}
            onChange={(e) => setSocialsText(e.target.value)}
          />
          <span className="text-xs text-muted-foreground">
            Keep it valid JSON; leave empty to omit.
          </span>
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={!canSubmit || busy}>
            {busy ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </div>

      {/* Right rail: simple preview (optional, minimal) */}
      <aside className="md:col-span-1">
        <div className="rounded-2xl border p-4 grid gap-3">
          <div className="text-sm font-semibold">Preview</div>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="avatar preview"
              src={avatarUrl}
              className="w-full rounded-2xl border object-cover"
            />
          ) : (
            <div className="rounded-2xl border p-3 text-xs text-muted-foreground">
              No avatar URL
            </div>
          )}
          <div className="grid gap-1">
            <div className="text-base font-medium">{name || "Name"}</div>
            <div className="text-sm text-muted-foreground">{title || "Title"}</div>
          </div>
          <div className="text-sm whitespace-pre-wrap">{bio || "Bio…"}</div>
        </div>
      </aside>
    </form>
  );
}

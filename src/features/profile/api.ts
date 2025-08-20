import { getOk } from '@/config/api'
// import type { Profile } from '@/lib/types'

export async function fetchProfile() {
  const res = await getOk<Profile>('/profile')
  return res.data
}

export type Profile = {
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  contactEmail?: string;
  phone?: string;
  socials?: Record<string, string>; // e.g., { twitter: "https://...", linkedin: "https://..." }
};

export async function getProfile(): Promise<Profile> {
  const res = await getOk<Profile>("/profile");
  return res.data;
}

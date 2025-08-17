// src/admin/profile/api.ts
import { getOk, http } from "@/config/api";

export type ProfilePayload = {
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  contactEmail?: string;
  phone?: string;
  socials?: Record<string, unknown> | null;
  published?: boolean;
};

export async function fetchProfile() {
  const res = await getOk<any>("/profile");
  return res.data; // public read
}

export async function updateProfile(payload: ProfilePayload) {
  // admin update
  await http.put("/api/v1/admin/profile", payload);
}

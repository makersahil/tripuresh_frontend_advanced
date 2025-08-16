import { getOk } from '@/config/api'
import type { Profile } from '@/lib/types'

export async function fetchProfile() {
  const res = await getOk<Profile>('/profile')
  return res.data
}

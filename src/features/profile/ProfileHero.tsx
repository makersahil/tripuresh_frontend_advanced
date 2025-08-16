import type { Profile } from '../../lib/types'
export default function ProfileHero({ profile }: { profile: Profile | null }) {
  if (!profile) return null
  return (
    <div className="bg-muted rounded-2xl p-6 shadow-soft">
      <h1 className="text-3xl font-bold">{profile.name}</h1>
      {profile.title && <p className="text-gray-600">{profile.title}</p>}
    </div>
  )
}

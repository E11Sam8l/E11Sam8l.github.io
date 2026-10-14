export interface ProfileAvatar { name: string; avatar?: string }

const avatars = import.meta.glob('../../about/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export function avatarFor(profile: ProfileAvatar): string | undefined {
  const requested = profile.avatar?.replace(/^\.\//, '').toLowerCase()
  return Object.entries(avatars).find(([path]) => {
    const filename = path.split('/').pop()!.toLowerCase()
    return requested ? filename === requested : filename.replace(/\.[^.]+$/, '') === profile.name.toLowerCase()
  })?.[1]
}

const decoded = new Map<string, Promise<void>>()
export async function prepareAvatars(profiles: ProfileAvatar[]): Promise<void> {
  await Promise.all(profiles.slice(0, 2).map(profile => {
    const src = avatarFor(profile)
    if (!src) return
    let task = decoded.get(src)
    if (!task) {
      const image = new Image()
      image.src = src
      task = image.decode().catch(() => { decoded.delete(src) })
      decoded.set(src, task)
    }
    return task
  }))
}

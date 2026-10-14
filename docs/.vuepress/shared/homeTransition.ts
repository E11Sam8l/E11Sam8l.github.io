const homePaths = new Set(['/', '/index.html'])
const transitionPaths = new Set(['/knowledge/', '/blog/', '/projects/', '/about/'])

export const isHomePath = (path: string): boolean => homePaths.has(path)

/** Resolve an internal link into the path Vue Router expects. */
export function resolveInternalTransitionTarget(
  href: string,
  locationHref: string,
  base = '/',
): string | undefined {
  const current = new URL(locationHref)
  const target = new URL(href, current)
  const normalizedBase = base.endsWith('/') ? base : `${base}/`

  if (target.origin !== current.origin) return undefined
  if (target.pathname !== normalizedBase && !target.pathname.startsWith(normalizedBase)) return undefined

  const relativePath = target.pathname.slice(normalizedBase.length)
  const path = relativePath ? `/${relativePath}` : '/'
  return `${path}${target.search}${target.hash}`
}

/** Only same-origin homepage-to-section navigation uses the circular reveal. */
export function resolveHomeTransitionTarget(
  sourcePath: string,
  href: string,
  locationHref: string,
  base = '/',
): string | undefined {
  if (!isHomePath(sourcePath)) return undefined
  const current = new URL(locationHref)
  const target = new URL(href, current)
  if (target.origin !== current.origin || !target.pathname.startsWith(base)) return undefined
  const path = `/${target.pathname.slice(base.length)}`
  if (!transitionPaths.has(path)) return undefined
  return `${path}${target.search}${target.hash}`
}

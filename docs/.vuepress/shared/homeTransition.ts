const homePaths = new Set(['/', '/index.html'])
const transitionPaths = new Set(['/knowledge/', '/blog/', '/projects/', '/about/'])

export const isHomePath = (path: string): boolean => homePaths.has(path)

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

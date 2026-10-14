// Share the same promises between Vue's async components and route warming.
// Failed requests can be retried; successful modules stay in the browser cache.
function once<T>(loader: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined
  return () => pending ??= loader().catch(error => {
    pending = undefined
    throw error
  })
}

export const loadContentBrowser = once(() => import('../components/ContentBrowser.vue'))
export const loadContentListPage = once(() => import('../components/ContentListPage.vue'))
export const loadAboutPage = once(() => import('../components/AboutPage.vue'))
export const loadPageContextMenu = once(() => import('vuepress-theme-plume/features/PageContextMenu.vue'))

export async function loadPageComponents(path: string): Promise<void> {
  if (/^\/about\/(?:index\.html)?$/.test(path)) await loadAboutPage()
  else if (/^\/(blog|knowledge|projects)\/(?:index\.html)?$/.test(path)) await loadContentListPage()
  else if (path !== '/' && path !== '/index.html') await loadPageContextMenu()
}

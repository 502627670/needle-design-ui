import defaultSettings from '@/settings'
import store from '@/store'

const title = defaultSettings.title || 'Vue Element Admin'

export default function getPageTitle(pageTitle) {
  let appName = store.getters.appName || title
  if (pageTitle) {
    return `${pageTitle} - ${appName}`
  }
  return `${appName}`

  // if (pageTitle) {
  //   return `${pageTitle} - ${title}`
  // }
  // return `${title}`
}

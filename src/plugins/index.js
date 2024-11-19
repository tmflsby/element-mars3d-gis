import { setupAmfeFlexible } from '@/plugins/amfeFlexible'
import { setupUnoCSS } from '@/plugins/unocss'
import { setupFontAwesome } from '@/plugins/fontAwesome'
import { setupDayjs } from '@/plugins/dayjs'
import { setupElementPlus } from '@/plugins/elementPlus'
import { setupMars3d } from '@/plugins/mars3d'
import { setupDirective } from '@/plugins/directive'
import { setupStyle } from '@/plugins/style'

export const setupPlugins = (app) => {
  setupAmfeFlexible()
  setupUnoCSS()
  setupFontAwesome()
  setupDayjs()
  setupElementPlus(app)
  setupMars3d(app)
  setupDirective(app)
  setupStyle()
}

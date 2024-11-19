import 'mars3d-cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'mars3d-cesium'
import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'

export const setupMars3d = (app) => {
  window.Cesium = Cesium
  window.mars3d = mars3d
  app.config.globalProperties.Cesium = Cesium
  app.config.globalProperties.mars3d = mars3d
}

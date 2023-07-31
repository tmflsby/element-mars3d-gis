const mars3dLayer = {
  // 蒙版图层
  async maskLayer(regionLevel, regionId) {
    let layerName = ''
    switch (regionLevel) {
      case 'CITY':
        layerName = 'sanming:shi'
        break
      case 'COUNTY':
        layerName = 'sanming:xian'
        break
      case 'TOWNSHIP':
        layerName = 'sanming:xiang'
        break
    }

    await new window.mars3d.query.QueryGeoServer({
      url: `/geoserver/sanming/wms`,
      layer: layerName,
      headers: {
        'X-Credentials': 'private-user=smuser',
        'Y-credentials': 'private-pw=sanming@123'
      }
    }).query({
      column: regionLevel === 'TOWNSHIP' ? 'code' : 'XZQDM',
      text: regionId,
      success: (result) => {
        // console.log(result)
        window.maskLayer = new window.mars3d.layer.GeoJsonLayer({
          data: result.geojson,
          mask: true,
          symbol: {
            styleOptions: {
              fill: true,
              color: '#ffffff',
              opacity: 0.75,
              clampToGround: true
            }
          }
        })
        window.map.addLayer(window.maskLayer)
      }
    })
  },

  // 初始化水库图标
  initWPStationRRIcon() {
    const WPStationRR_Layer = window.map.getLayerById('4001')
    WPStationRR_Layer.clear()
    // console.log(WPStationRR_Layer)

    window.WPD.get('WPStationRR').forEach((station) => {
      switch (station.rrType) {
        case 'I':
          station.rrType = '大(1)型'
          break
        case 'II':
          station.rrType = '大(2)型'
          break
        case 'III':
          station.rrType = '中型'
          break
        case 'IV':
          station.rrType = '小(1)型'
          break
        case 'V':
          station.rrType = '小(2)型'
          break
        default:
          break
      }
      const distanceDisplayCondition = WPStationRR_Layer.options.importStation.includes(station.id)
        ? new window.Cesium.DistanceDisplayCondition(0, 800000)
        : new window.Cesium.DistanceDisplayCondition(0, 80000)
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.longitude, station.latitude],
        style: {
          image: './img/station/StationRR_Blue.png',
          scale: 0.75,
          distanceDisplayCondition,
          label: {
            text: station.name.trim(),
            font_size: 14,
            background: true,
            backgroundColor: '#165b6d',
            color: '#fff',
            outline: true,
            outlineColor: '#fff',
            outlineWidth: 2,
            horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: window.Cesium.VerticalOrigin.CENTER,
            pixelOffsetY: 25,
            distanceDisplayCondition
          }
        }
      })
      WPStationRR_Layer.addGraphic(graphic)
    })
  },

  // 初始化水文站图标
  initWPStationZQIcon() {
    const WPStationZQ_Layer = window.map.getLayerById('4002')
    WPStationZQ_Layer.clear()

    window.WPD.get('WPStationZQ').forEach((station) => {
      const distanceDisplayCondition = WPStationZQ_Layer.options.importStation.includes(station.id)
        ? new window.Cesium.DistanceDisplayCondition(0, 800000)
        : new window.Cesium.DistanceDisplayCondition(0, 80000)
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.longitude, station.latitude],
        style: {
          image: './img/station/StationZQ_Blue.png',
          scale: 0.75,
          distanceDisplayCondition,
          label: {
            text: station.name.trim(),
            font_size: 14,
            background: true,
            backgroundColor: '#165b6d',
            color: '#fff',
            outline: true,
            outlineColor: '#fff',
            outlineWidth: 2,
            horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: window.Cesium.VerticalOrigin.CENTER,
            pixelOffsetY: 25,
            distanceDisplayCondition
          }
        }
      })
      WPStationZQ_Layer.addGraphic(graphic)
    })
  },

  // 初始化水位站图标
  initWPStationZZIcon() {
    const WPStationZZ_Layer = window.map.getLayerById('4003')
    WPStationZZ_Layer.clear()

    window.WPD.get('WPStationZZ').forEach((station) => {
      const distanceDisplayCondition = WPStationZZ_Layer.options.importStation.includes(station.id)
        ? new window.Cesium.DistanceDisplayCondition(0, 800000)
        : new window.Cesium.DistanceDisplayCondition(0, 80000)
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.longitude, station.latitude],
        style: {
          image: './img/station/StationZZ_Blue.png',
          scale: 0.75,
          distanceDisplayCondition,
          label: {
            text: station.name.trim(),
            font_size: 14,
            background: true,
            backgroundColor: '#165b6d',
            color: '#fff',
            outline: true,
            outlineColor: '#fff',
            outlineWidth: 2,
            horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: window.Cesium.VerticalOrigin.CENTER,
            pixelOffsetY: 25,
            distanceDisplayCondition
          }
        }
      })
      WPStationZZ_Layer.addGraphic(graphic)
    })
  },

  // 初始化雨量站图标q
  initWPStationPPIcon() {
    const WPStationPP_Layer = window.map.getLayerById('4004')
    WPStationPP_Layer.clear()

    window.WPD.get('WPStationPP').forEach((station) => {
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.longitude, station.latitude],
        style: {
          image: './img/station/StationPP_0.png',
          scale: 0.75,
          distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, 80000),
          label: {
            text: station.name.trim(),
            font_size: 14,
            background: true,
            backgroundColor: '#525252',
            color: '#fff',
            outline: true,
            outlineColor: '#fff',
            outlineWidth: 2,
            horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: window.Cesium.VerticalOrigin.CENTER,
            pixelOffsetY: 25,
            distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, 80000)
          }
        }
      })
      WPStationPP_Layer.addGraphic(graphic)
    })
  }
}

export default mars3dLayer

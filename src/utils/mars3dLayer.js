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
    const WPStationRR_Layer = window.map.getLayerById(4001)
    window.map.addLayer(WPStationRR_Layer)
    WPStationRR_Layer.clear()
    // console.log(WPStationRR_Layer)

    window.WPD.get('WPStationRR').forEach((station) => {
      station.name = station.name.trim()
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
          image: './img/station/StationRR_0.png',
          scale: 0.75,
          distanceDisplayCondition,
          label: {
            text: station.name,
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
    const WPStationZQ_Layer = window.map.getLayerById(4002)
    window.map.addLayer(WPStationZQ_Layer)
    WPStationZQ_Layer.clear()

    window.WPD.get('WPStationZQ').forEach((station) => {
      station.name = station.name.trim()
      const distanceDisplayCondition = WPStationZQ_Layer.options.importStation.includes(station.id)
        ? new window.Cesium.DistanceDisplayCondition(0, 800000)
        : new window.Cesium.DistanceDisplayCondition(0, 80000)
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.longitude, station.latitude],
        style: {
          image: './img/station/StationZQ_0.png',
          scale: 0.75,
          distanceDisplayCondition,
          label: {
            text: station.name,
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
    const WPStationZZ_Layer = window.map.getLayerById(4003)
    window.map.addLayer(WPStationZZ_Layer)
    WPStationZZ_Layer.clear()

    window.WPD.get('WPStationZZ').forEach((station) => {
      station.name = station.name.trim()
      const distanceDisplayCondition = WPStationZZ_Layer.options.importStation.includes(station.id)
        ? new window.Cesium.DistanceDisplayCondition(0, 800000)
        : new window.Cesium.DistanceDisplayCondition(0, 80000)
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.longitude, station.latitude],
        style: {
          image: './img/station/StationZZ_0.png',
          scale: 0.75,
          distanceDisplayCondition,
          label: {
            text: station.name,
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

  // 初始化雨量站图标
  initWPStationPPIcon() {
    const WPStationPP_Layer = window.map.getLayerById(4004)
    window.map.addLayer(WPStationPP_Layer)
    WPStationPP_Layer.clear()

    window.WPD.get('WPStationPP').forEach((station) => {
      station.name = station.name.trim()
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.longitude, station.latitude],
        style: {
          image: './img/station/StationPP_0.png',
          scale: 0.75,
          distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, 80000),
          label: {
            text: station.name,
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
  },

  // 初始化水电站图标
  initWPStationHPIcon() {
    const WPStationHP_Layer = window.map.getLayerById(4005)
    window.map.addLayer(WPStationHP_Layer)
    WPStationHP_Layer.clear()

    window.WPD.get('WPStationHP').forEach((station) => {
      station.name = station.name.trim()
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.longitude, station.latitude],
        style: {
          image: './img/station/StationHP.png',
          scale: 0.75,
          distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, 80000)
        }
      })
      WPStationHP_Layer.addGraphic(graphic)
    })
  },

  // 初始化水闸图标
  initWPSluiceIcon() {
    const WPSluice_Layer = window.map.getLayerById(4006)
    window.map.addLayer(WPSluice_Layer)
    WPSluice_Layer.clear()

    window.WPD.get('WPSluice').forEach((station) => {
      station.name = station.name.trim()
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.longitude, station.latitude],
        style: {
          image: './img/station/WPSluice.png',
          scale: 0.75,
          distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, 80000)
        }
      })
      WPSluice_Layer.addGraphic(graphic)
    })
  },

  // 初始化泵站图标
  initWPStationPumpIcon() {
    const WPStationPump_Layer = window.map.getLayerById(4007)
    window.map.addLayer(WPStationPump_Layer)
    WPStationPump_Layer.clear()

    window.WPD.get('WPStationPump').forEach((station) => {
      station.name = station.name.trim()
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.longitude, station.latitude],
        style: {
          image: './img/station/WPStationPump.png',
          scale: 0.75,
          distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, 80000)
        }
      })
      WPStationPump_Layer.addGraphic(graphic)
    })
  },

  // 初始化易淹区水位计图标
  initEasilyFloodedAreaIcon() {
    const EasilyFloodedArea_Layer = window.map.getLayerById(4008)
    window.map.addLayer(EasilyFloodedArea_Layer)
    EasilyFloodedArea_Layer.clear()

    window.WPD.get('EasilyFloodedArea').forEach((station) => {
      station.deviceName = station.deviceName.trim()
      const graphic = new window.mars3d.graphic.BillboardEntity({
        attr: station,
        position: [station.lng, station.lat],
        style: {
          image: './img/station/EasilyFloodedArea.png',
          scale: 0.5,
          distanceDisplayCondition: new window.Cesium.DistanceDisplayCondition(0, 80000)
        }
      })
      EasilyFloodedArea_Layer.addGraphic(graphic)
    })
  },

  // 水系增加popup
  addWPRiverPopup() {
    const WPRiver_Layer = window.map.getLayerById(2003)
    window.map.addLayer(WPRiver_Layer)
    WPRiver_Layer.on(window.mars3d.EventType.click, (event) => {
      console.log(event)
      const river = window.WPD.get('WPRiver').get(event.attr.ID)
      console.log(river)
      WPRiver_Layer.bindPopup(`
        <div>
          <div>名称：${river.name}</div>
          <div>长度(km)：${river.FlowLength}</div>
           <div>等级：${river.level}</div>
          <div>途径县：${river.PathwayCountyName}</div>
          <div>途径乡：${river.PathwayTownName}</div>
        </div>
      `)
    })
  }
}

export default mars3dLayer

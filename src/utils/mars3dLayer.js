const mars3dLayer = {
  // 蒙版图层
  maskLayer(regionLevel, regionId) {
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

    new window.mars3d.query.QueryGeoServer({
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
        window.CustomLayer.maskLayer = new window.mars3d.layer.GeoJsonLayer({
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
        window.map.addLayer(window.CustomLayer.maskLayer)
      }
    })
  },

  // 初始化水库图标
  initWPStationRRIcon() {
    const WPStationRR_Layer = window.map.getLayerById(4001)
    window.map.addLayer(WPStationRR_Layer)

    window.WPD.get('WPStationRR').forEach((station, key) => {
      if (key === 'field') return
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

    window.WPD.get('WPStationZQ').forEach((station, key) => {
      if (key === 'field') return
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

    window.WPD.get('WPStationZZ').forEach((station, key) => {
      if (key === 'field') return
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

    window.WPD.get('WPStationPP').forEach((station, key) => {
      if (key === 'field') return
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

    window.WPD.get('WPStationHP').forEach((station, key) => {
      if (key === 'field') return
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

    window.WPD.get('WPSluice').forEach((station, key) => {
      if (key === 'field') return
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

    window.WPD.get('WPStationPump').forEach((station, key) => {
      if (key === 'field') return
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

    window.WPD.get('EasilyFloodedArea').forEach((station, key) => {
      if (key === 'field') return
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
  },

  // 台风警戒线
  typhoonAlarmLineLayer() {
    window.CustomLayer.typhoonAlarmLineLayer = new window.mars3d.layer.GraphicLayer()
    window.map.addLayer(window.CustomLayer.typhoonAlarmLineLayer)

    // 绘制24小时警戒线
    const lineWarning24 = new window.mars3d.graphic.PolylineEntity({
      name: 'lineWarning24',
      positions: [
        [127, 34],
        [127, 22],
        [119, 18],
        [119, 11],
        [113, 4.5],
        [105, 0]
      ],
      style: {
        color: '#828314',
        width: 2,
        zIndex: 1
      }
    })
    window.CustomLayer.typhoonAlarmLineLayer.addGraphic(lineWarning24)

    // 注记文本
    const textWarning24 = new window.mars3d.graphic.RectangleEntity({
      name: 'textWarning24',
      positions: [
        [128.129019, 29.104287],
        [125.850451, 28.424599]
      ],
      style: {
        materialType: window.mars3d.MaterialType.Text,
        materialOptions: {
          text: '24小时警戒线',
          font: '80px 楷体',
          color: '#828314',
          backgroundColor: new window.Cesium.Color(0.0, 0.0, 0.0, 0)
        },
        rotationDegree: 90
      }
    })
    window.CustomLayer.typhoonAlarmLineLayer.addGraphic(textWarning24)

    // 绘制48小时警戒线
    const lineWarning48 = new window.mars3d.graphic.PolylineEntity({
      name: 'lineWarning48',
      positions: [
        [132, 34],
        [132, 22],
        [119, 0],
        [105, 0]
      ],
      style: {
        width: 2,
        materialType: window.mars3d.MaterialType.PolylineDash,
        materialOptions: {
          dashLength: 20.0,
          color: '#4dba3d'
        }
      }
    })
    window.CustomLayer.typhoonAlarmLineLayer.addGraphic(lineWarning48)

    // 注记文本
    const textWarning48 = new window.mars3d.graphic.RectangleEntity({
      name: 'textWarning48',
      positions: [
        [130.502492, 25.959716],
        [133.423638, 26.772991]
      ],
      style: {
        materialType: window.mars3d.MaterialType.Text,
        materialOptions: {
          text: '48小时警戒线',
          font: '80px 楷体',
          color: '#4dba3d',
          backgroundColor: new window.Cesium.Color(0.0, 0.0, 0.0, 0)
        },
        rotationDegree: 90,
        zIndex: 4
      }
    })
    window.CustomLayer.typhoonAlarmLineLayer.addGraphic(textWarning48)
  },

  // 根据经纬度 直径 以及方向计算方法
  getPoints(center, cradius, startAngle) {
    const points = []
    const radius = cradius / 100
    const pointNum = 90
    const endAngle = startAngle + 90
    let sin, cos, x, y, angle
    for (let i = 0; i <= pointNum; i++) {
      angle = startAngle + ((endAngle - startAngle) * i) / pointNum
      sin = Math.sin((angle * Math.PI) / 180)
      cos = Math.cos((angle * Math.PI) / 180)
      x = center[0] + radius * sin
      y = center[1] + radius * cos
      points.push([x, y])
    }
    return points
  },
  // 台风路径
  typhoonPathLayer(typhoonPathData) {
    if (!window.CustomLayer.typhoonPathLayer) {
      window.CustomLayer.typhoonPathLayer = {}
    }
    if (!window.CustomLayer.typhoonPathLayer[typhoonPathData.eName]) {
      window.CustomLayer.typhoonPathLayer[typhoonPathData.eName] =
        new window.mars3d.layer.GraphicLayer()
      window.map.addLayer(window.CustomLayer.typhoonPathLayer[typhoonPathData.eName])
    }

    // 绘制 typhoonData 已经吹过的路径
    let typhoonDataPointArr = []
    for (let i = 0; i < typhoonPathData.typhoonData.length; i++) {
      const typhoonDataItem = typhoonPathData.typhoonData[i]
      const currentPoint = [typhoonDataItem.longitude, typhoonDataItem.latitude]
      typhoonDataPointArr.push(currentPoint)
      const radius7Quad = typhoonDataItem.radius7Quad.split(',').map((item) => +item)
      const radius10Quad = typhoonDataItem.radius10Quad.split(',').map((item) => +item)
      const radius12Quad = typhoonDataItem.radius12Quad.split(',').map((item) => +item)
      const radius7QuadTest = `${Math.min(...radius7Quad)}-${Math.max(...radius7Quad)}公里`
      const radius10QuadTest = `${Math.min(...radius10Quad)}-${Math.max(...radius10Quad)}公里`
      const radius12QuadTest = `${Math.min(...radius12Quad)}-${Math.max(...radius12Quad)}公里`
      const tooltip = `
          <div class="typhoon-tooltip" style="font-size: 16px">
            <div class="typhoon-tooltip-item" style="font-size: 18px;font-weight: bold">
              ${typhoonDataItem.typhoonNo} ${typhoonDataItem.cName}
            </div>
            <div class="typhoon-tooltip-item">
              过去时间：${typhoonDataItem.cTimeString}
            </div>
            <div class="typhoon-tooltip-item">
              中心位置：${typhoonDataItem.longitude}E,${typhoonDataItem.latitude}N
            </div>
            <div class="typhoon-tooltip-item">
              最大风力：${typhoonDataItem.windPower}级别
            </div>
            <div class="typhoon-tooltip-item">
              最大风速：${typhoonDataItem.windSpeed}米/秒
            </div>
            <div class="typhoon-tooltip-item">
              中心气压：${typhoonDataItem.pressure}百帕
            </div>
            <div class="typhoon-tooltip-item">
              移动速度：${typhoonDataItem.moveSpeed}公里/小时
            </div>
            <div class="typhoon-tooltip-item">
              移动方向：${typhoonDataItem.moveDir}
            </div>
            <div class="typhoon-tooltip-item">
              七级风圈半径：${radius7Quad.includes(9999) ? '-' : radius7QuadTest}
            </div>
            <div class="typhoon-tooltip-item">
              十级风圈半径：${radius10Quad.includes(9999) ? '-' : radius10QuadTest}
            </div>
            <div class="typhoon-tooltip-item">
              十二级风圈半径：${radius12Quad.includes(9999) ? '-' : radius12QuadTest}
            </div>
          </div>
        `

      // 绘制点
      const point = new window.mars3d.graphic.PointEntity({
        position: currentPoint,
        style: {
          pixelSize: 6,
          color: typhoonDataItem.typhoonColor
        },
        tooltip
      })
      window.CustomLayer.typhoonPathLayer[typhoonPathData.eName].addGraphic(point)

      // 绘制线
      const line = new window.mars3d.graphic.PolylineEntity({
        positions: typhoonDataPointArr,
        style: {
          color: typhoonDataItem.typhoonColor
        }
      })
      window.CustomLayer.typhoonPathLayer[typhoonPathData.eName].addGraphic(line)
      typhoonDataPointArr = [currentPoint]

      if (i === typhoonPathData.typhoonData.length - 1) {
        // 绘制台风图标
        const typhoonIcon = new window.mars3d.graphic.DivGraphic({
          position: currentPoint,
          style: {
            html: `<img src="./img/icon/typhoon.gif" alt=''>`,
            horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: window.Cesium.VerticalOrigin.CENTER
          }
        })
        window.CustomLayer.typhoonPathLayer[typhoonPathData.eName].addGraphic(typhoonIcon)

        // 绘制7级风圈
        if (!radius7Quad.includes(9999)) {
          let points7 = []
          points7 = points7.concat(mars3dLayer.getPoints(currentPoint, radius7Quad[0], 0)) // 东北
          points7 = points7.concat(mars3dLayer.getPoints(currentPoint, radius7Quad[1], 90)) // 东南
          points7 = points7.concat(mars3dLayer.getPoints(currentPoint, radius7Quad[2], 180)) // 西南
          points7 = points7.concat(mars3dLayer.getPoints(currentPoint, radius7Quad[3], 270)) // 西北
          const circle7 = new window.mars3d.graphic.PolygonEntity({
            positions: points7,
            style: {
              setHeight: 900,
              color: '#eed139',
              opacity: 0.3,
              outline: true,
              outlineWidth: 2,
              outlineColor: '#eed139'
            }
          })
          window.CustomLayer.typhoonPathLayer[typhoonPathData.eName].addGraphic(circle7)
        }

        // 绘制10级风圈
        if (!radius10Quad.includes(9999)) {
          let points10 = []
          points10 = points10.concat(mars3dLayer.getPoints(currentPoint, radius10Quad[0], 0)) // 东北
          points10 = points10.concat(mars3dLayer.getPoints(currentPoint, radius10Quad[1], 90)) // 东南
          points10 = points10.concat(mars3dLayer.getPoints(currentPoint, radius10Quad[2], 180)) // 西南
          points10 = points10.concat(mars3dLayer.getPoints(currentPoint, radius10Quad[3], 270)) // 西北
          const circle10 = new window.mars3d.graphic.PolygonEntity({
            positions: points10,
            style: {
              setHeight: 800,
              color: '#fe9c45',
              opacity: 0.3,
              outline: true,
              outlineWidth: 2,
              outlineColor: '#fe9c45',
              arcType: window.Cesium.ArcType.GEODESIC
            }
          })
          window.CustomLayer.typhoonPathLayer[typhoonPathData.eName].addGraphic(circle10)
        }

        // 绘制12级风圈
        if (!radius12Quad.includes(9999)) {
          let points12 = []
          points12 = points12.concat(mars3dLayer.getPoints(currentPoint, radius12Quad[0], 0)) // 东北
          points12 = points12.concat(mars3dLayer.getPoints(currentPoint, radius12Quad[1], 90)) // 东南
          points12 = points12.concat(mars3dLayer.getPoints(currentPoint, radius12Quad[2], 180)) // 西南
          points12 = points12.concat(mars3dLayer.getPoints(currentPoint, radius12Quad[3], 270)) // 西北
          const circle12 = new window.mars3d.graphic.PolygonEntity({
            positions: points12,
            style: {
              setHeight: 700,
              color: '#ffff00',
              opacity: 0.3,
              outline: true,
              outlineWidth: 2,
              outlineColor: '#ffff00',
              arcType: window.Cesium.ArcType.GEODESIC
            }
          })
          window.CustomLayer.typhoonPathLayer[typhoonPathData.eName].addGraphic(circle12)
        }
      }
    }

    // 绘制 forecastData 预测路径
    for (let i = 0; i < typhoonPathData.forecastData.length; i++) {
      const forecastCountry = typhoonPathData.forecastData[i]
      let forecastCountryPointArr = []
      for (let j = 0; j < forecastCountry.length; j++) {
        const forecastCountryItem = forecastCountry[j]
        const currentPoint = [forecastCountryItem.longitude, forecastCountryItem.latitude]
        forecastCountryPointArr.push(currentPoint)
        let radius7Quad = []
        let radius7QuadTest = ''
        if (forecastCountryItem.radius7Quad) {
          radius7Quad = forecastCountryItem.radius7Quad.split(',').map((item) => +item)
          radius7QuadTest = `${Math.min(...radius7Quad)}-${Math.max(...radius7Quad)}公里`
        }
        let radius10Quad = []
        let radius10QuadTest = ''
        if (forecastCountryItem.radius10Quad) {
          radius10Quad = forecastCountryItem.radius10Quad.split(',').map((item) => +item)
          radius10QuadTest = `${Math.min(...radius10Quad)}-${Math.max(...radius10Quad)}公里`
        }
        let radius12Quad = []
        let radius12QuadTest = ''
        if (forecastCountryItem.radius12Quad) {
          radius12Quad = forecastCountryItem.radius12Quad.split(',').map((item) => +item)
          radius12QuadTest = `${Math.min(...radius12Quad)}-${Math.max(...radius12Quad)}公里`
        }
        const tooltip = `
          <div class="typhoon-tooltip" style="font-size: 16px">
            <div class="typhoon-tooltip-item" style="font-size: 18px;font-weight: bold">
              ${forecastCountryItem.typhoonNo} ${forecastCountryItem.cName}
            </div>
            <div class="typhoon-tooltip-item">
              预测机构：${forecastCountry.forecastCountry}
            </div>
            <div class="typhoon-tooltip-item">
              到达时间：${forecastCountryItem.forecastTimeString}
            </div>
            <div class="typhoon-tooltip-item">
              中心位置：${forecastCountryItem.longitude}E,${forecastCountryItem.latitude}N
            </div>
            <div class="typhoon-tooltip-item">
              最大风力：${forecastCountryItem.windPower}级别
            </div>
            <div class="typhoon-tooltip-item">
              最大风速：${
                forecastCountryItem.windSpeed === 9999
                  ? '-'
                  : forecastCountryItem.windSpeed + '米/秒'
              }
            </div>
            <div class="typhoon-tooltip-item">
              中心气压：${
                forecastCountryItem.pressure === 9999 ? '-' : forecastCountryItem.pressure + '百帕'
              }
            </div>
            <div class="typhoon-tooltip-item">
              移动速度：${
                forecastCountryItem.moveSpeed === 0
                  ? '-'
                  : forecastCountryItem.moveSpeed + '公里/小时'
              }
            </div>
            <div class="typhoon-tooltip-item">
              移动方向：${forecastCountryItem.moveDir === null ? '-' : forecastCountryItem.moveDir}
            </div>
            <div class="typhoon-tooltip-item">
              七级风圈半径：${radius7Quad.includes(9999) ? '-' : radius7QuadTest}
            </div>
            <div class="typhoon-tooltip-item">
              十级风圈半径：${radius10Quad.includes(9999) ? '-' : radius10QuadTest}
            </div>
            <div class="typhoon-tooltip-item">
              十二级风圈半径：${radius12Quad.includes(9999) ? '-' : radius12QuadTest}
            </div>
          </div>
        `

        // 绘制点
        const point = new window.mars3d.graphic.PointEntity({
          position: currentPoint,
          style: {
            pixelSize: 6,
            color: forecastCountryItem.typhoonColor,
            opacity: 0.8
          },
          tooltip
        })
        window.CustomLayer.typhoonPathLayer[typhoonPathData.eName].addGraphic(point)

        // 绘制线
        const line = new window.mars3d.graphic.PolylineEntity({
          positions: forecastCountryPointArr,
          style: {
            materialType: window.mars3d.MaterialType.PolylineDash,
            materialOptions: {
              dashLength: 20.0,
              color: forecastCountryItem.typhoonColor
            }
          }
        })
        window.CustomLayer.typhoonPathLayer[typhoonPathData.eName].addGraphic(line)

        forecastCountryPointArr = [currentPoint]
      }
    }

    window.CustomLayer.typhoonPathLayer[typhoonPathData.eName].flyTo()
  }
}

export default mars3dLayer

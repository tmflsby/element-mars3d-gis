const mars3dLayer = {
  // 蒙版图层
  async maskLayer(regionType, regionId) {
    mars3dLayer.clearMaskLayer()

    let layerName = ''
    switch (regionType) {
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
      // column: regionType === 'TOWNSHIP' ? 'code' : 'XZQDM',
      // text: regionId,
      success: (result) => {
        console.log(result)
        // result.geojson.features.forEach(item => {
        //   window.areaMaskLayer = new ArkWeb.layer.GeoJsonLayer({
        //     data: item,
        //     "mask": true,
        //     "symbol": {
        //       "styleOptions": {
        //         "fill": true,
        //         "color": "#ffffff",
        //         "opacity": 0.75,
        //         "clampToGround": true
        //       }
        //     }
        //   })
        //   window.map.addLayer(window.areaMaskLayer)
        // })
      }
    })
  },
  clearMaskLayer() {}
}

export default mars3dLayer

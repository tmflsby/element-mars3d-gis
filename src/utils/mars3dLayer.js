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
  }
}

export default mars3dLayer

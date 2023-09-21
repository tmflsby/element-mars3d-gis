import service from '@/api/service'

export const magnitudeRain_getAllRain = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/magnitudeRain/getAllRain`,
    params
  })

export const magnitudeRain_getHistoryRainMonitorSegment = (params, data) =>
  service({
    method: 'post',
    url: `/wpd-sanming/magnitudeRain/getHistoryRainMonitorSegment`,
    params,
    data
  })

export const magnitudeRain_getGradingSiteInfo = (params, data) =>
  service({
    method: 'post',
    url: `/wpd-sanming/magnitudeRain/getGradingSiteInfo`,
    params,
    data
  })

export const magnitudeRain_getArbitrarilyRainMonitorByArea = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/magnitudeRain/getArbitrarilyRainMonitorByArea`,
    params
  })

export const magnitudeRain_getMagnitudeRainAreaByType = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/magnitudeRain/getMagnitudeRainAreaByType`,
    params
  })

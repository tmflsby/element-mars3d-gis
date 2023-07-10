import service from '@/api/service'

export const magnitudeRain_getAllRain = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/magnitudeRain/getAllRain`,
    params
  })

import service from '@/api/service'

export const weather_getTyphoonList = (params) =>
  service({
    method: 'get',
    url: `/weather/api/Meteo/Typhoon/GetTyphoonList`,
    params
  })

export const weather_getTyphoonPath = (params) =>
  service({
    method: 'get',
    url: `/weather/api/Meteo/Typhoon/GetTyphoonPath`,
    params
  })

export const weather_getPage = (params) =>
  service({
    method: 'get',
    url: `/weather/api/Meteo/GeoImage/GetPage`,
    params
  })

export const AlarmSingal_Page = (params) =>
  service({
    method: 'get',
    url: `/weather/api/Meteo/AlarmSingal/Page`,
    params
  })

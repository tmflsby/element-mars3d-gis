import service from '@/api/service'

export const Typhoon_GetTyphoonList = (params) =>
  service({
    method: 'get',
    url: `/weather/api/Meteo/Typhoon/GetTyphoonList`,
    params
  })

export const Typhoon_GetTyphoonPath = (params) =>
  service({
    method: 'get',
    url: `/weather/api/Meteo/Typhoon/GetTyphoonPath`,
    params
  })

export const GeoImage_GetPage = (params) =>
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

export const AlarmSingal_GetProcessList = (params) =>
  service({
    method: 'get',
    url: `/weather/api/Meteo/AlarmSingal/GetProcessList`,
    params
  })

export const AlarmSingal_GetDefenseGuide = (params) =>
  service({
    method: 'get',
    url: `/weather/api/Meteo/AlarmSingal/GetDefenseGuide`,
    params
  })

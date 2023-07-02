import service from '@/api/service'

export const weather_getTyphoonList = (params) =>
  service({
    method: 'get',
    url: `/weather/api/Meteo/Typhoon/GetTyphoonList`,
    params
  })

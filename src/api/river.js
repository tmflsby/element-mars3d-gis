import service from '@/api/service'

export const river_getRiverByAdministrativeArea = (params, data) =>
  service({
    method: 'post',
    url: `/wpd-sanming/river/getRiverByAdministrativeArea`,
    params,
    data
  })

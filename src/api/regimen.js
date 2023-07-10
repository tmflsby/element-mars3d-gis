import service from '@/api/service'

export const regimen_regimenQuery = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/regimen/regimenQuery`,
    params
  })

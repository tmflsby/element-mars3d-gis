import service from '@/api/service'

export const siteInfo_getRRTypeCount = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/siteInfo/getRRTypeCount`,
    params
  })

import service from '@/api/service'

export const text_getFldSituationText = (params) =>
  service({
    method: 'get',
    url: '/wpd-sanming/text/getFldSituationText',
    params,
    responseType: 'blob'
  })

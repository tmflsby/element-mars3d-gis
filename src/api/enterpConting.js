import service from '@/api/service'

export const enterpConting_goodsMaterials = (params) =>
  service({
    method: 'get',
    url: '/wpd-sanming/enterpConting/goodsMaterials',
    params
  })

export const enterpConting_takeRefuge = (params) =>
  service({
    method: 'get',
    url: '/wpd-sanming/enterpConting/takeRefuge',
    params
  })

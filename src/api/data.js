import service from '@/api/service'

export const data_getMonitorData = (params) =>
  service({
    method: 'get',
    url: '/wpd-sanming/data/getMonitorData',
    params
  })

export const data_getMonitorDatas = (params) =>
  service({
    method: 'get',
    url: '/wpd-sanming/data/getMonitorDatas',
    params
  })

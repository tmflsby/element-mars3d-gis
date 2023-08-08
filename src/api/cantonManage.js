import service from '@/api/service'

export const cantonManage_queryObjectInfos = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/cantonManage/queryObjectInfos`,
    params
  })

export const cantonManage_queryObjectTreeInfo = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/cantonManage/queryObjectTreeInfo`,
    params
  })

import service from '@/api/service'

export const tool_storage_getStorageByLevel = (params, data) =>
  service({
    method: 'post',
    url: '/wpd-sanming/tool/storage/getStorageByLevel',
    params,
    data
  })

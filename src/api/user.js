import service from '@/api/service'
export const system_user_info = (params) =>
  service({
    url: `/wpd-sanming/system/user/info`,
    params
  })

export const user_custom_storage_getAllByUserAndDate = (params) =>
  service({
    url: `/wpd-sanming/user/custom/storage/getAllByUserAndDate`,
    params
  })

export const user_custom_storage_addCustomStorage = (params, data) =>
  service({
    method: 'post',
    url: '/wpd-sanming/user/custom/storage/addCustomStorage',
    params,
    data
  })

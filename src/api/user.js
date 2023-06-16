import service from '@/api/service'
export const system_user_info = (params) =>
  service({
    url: `/wpd-sanming/system/user/info`,
    params
  })

import service from '@/api/service'

export const disPoint_getDisasterSiteData = (params) =>
  service({
    method: 'post',
    url: `/wpd-sanming/disPoint/getDisasterSiteData`,
    params
  })

export const disPoint_getDisasterOtherObjects = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/disPoint/getDisasterOtherObjects`,
    params
  })

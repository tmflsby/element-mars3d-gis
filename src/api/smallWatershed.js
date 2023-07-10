import service from '@/api/service'

export const smallWatershed_getAreaQList = (params) =>
  service({
    method: 'get',
    url: `/smallWatershed/yssysanming/public/api/getAreaQList`,
    params
  })

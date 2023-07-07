import service from '@/api/service'

export const curveLookup_getImportInfoById = (params) =>
  service({
    url: `/wpd-sanming/curveLookup/getImportInfoById`,
    params
  })

import service from '@/api/service'

export const project_queryobjects = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/project/queryobjects`,
    params
  })

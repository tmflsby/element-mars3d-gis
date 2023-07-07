import service from '@/api/service'

export const ztq_service = (params, data) =>
  service({
    method: 'post',
    url: `/ztq/ztq30_fj_jc/service.do`,
    params,
    data
  })

import service from '@/api/service'

export const sift_siftObj = (params, data) =>
  service({
    method: 'post',
    url: `/wpd-sanming/sift/siftObj`,
    params,
    data
  })

export const sift_disposeDzObj = (params, data) =>
  service({
    method: 'post',
    url: `/wpd-sanming/sift/disposeDzObj`,
    params,
    data
  })

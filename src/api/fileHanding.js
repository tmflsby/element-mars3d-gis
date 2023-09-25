import service from '@/api/service'

export const fileHanding_fileDownload = (params) =>
  service({
    method: 'get',
    url: '/wpd-sanming/fileHanding/fileDownload',
    params,
    responseType: 'blob'
  })

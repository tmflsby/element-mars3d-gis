import service from '@/api/service'

export const captcha_image = (params) =>
  service({
    method: 'get',
    url: `/wpd-sanming/captcha/image/${+(100000000 * Math.random()).toFixed(0)}`,
    params
  })

export const oauth_token = (params) =>
  service({
    method: 'post',
    url: `/wpd-sanming/oauth/token`,
    params
  })

export const oauth_check_token = (params) =>
  service({
    method: 'post',
    url: `/wpd-sanming/oauth/check_token`,
    params,
    headers: {
      authorization: 'Basic d3BkOndwZA=='
    }
  })

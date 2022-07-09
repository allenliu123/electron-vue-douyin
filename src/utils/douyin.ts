const request = require('request');
const rp = require('request-promise');

/**
 * 获取用户信息
 * @param {string} sec_uid 用户 id
 * @returns 用户信息
 */
export function getUserInfo(sec_uid: string) {
  return new Promise((resolve, reject) => {
    rp({
      method: 'get',
      uri: 'https://www.iesdouyin.com/web/api/v2/user/info/?sec_uid=' + sec_uid,
      json: true
    }).then((info: any) => {
      if (info.status_code === 0) {
        resolve(info.user_info)
      } else {
        reject('获取用户信息失败')
      }
    }).catch(reject)
  })
}

// 解析 url https://www.douyin.com/user/MS4wLjABAAAA7pHW32vyOVNmUjzv3ze0Dt_9l-czozeBGzWzxmyCZn_3rbgHa_V5OSjUWPxzJQCx
export function parseHomeUrl(url: string) {
  const reg = new RegExp('https:\/\/www.douyin.com/user/(.*)[?|\/]?')
  const matchResult = url.match(reg)
  if (!matchResult) {
    return ''
  }
  return matchResult[1]
}

// test
// run `npx tsc douyin.ts && node douyin.js`
// parseHomeUrl('https://www.douyin.com/user/MS4wLjABAAAA7pHW32vyOVNmUjzv3ze0Dt_9l-czozeBGzWzxmyCZn_3rbgHa_V5OSjUWPxzJQCx/123')
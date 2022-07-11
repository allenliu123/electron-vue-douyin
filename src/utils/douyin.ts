const request = require('request');
const rp = require('request-promise');
const fs = require('fs');
import generateSignature from '../common/generateSignature.js'

/**
 * 获取用户信息
 * @param {string} sec_uid 用户 id
 * @returns 用户信息
 */
export function getUserInfo(sec_uid: string): any {
  return new Promise((resolve, reject) => {
    rp({
      method: 'get',
      uri: 'https://www.iesdouyin.com/web/api/v2/user/info/?sec_uid=' + sec_uid,
      json: true
    }).then((info: any) => {
      if (info.status_code === 0) {
        resolve({
          info: info.user_info,
          extraNow: info.extra.now
        })
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

/**
 * 获取抖音用户视频列表
 * @param {string} sec_uid  用户 id
 * @param {number | string} count  用户视频个数
 * @param {number | string} max_cursor 时间最大值 1656743890000 => 2022-07-02 14:38:10
 * @returns 
 */
export function getVideoList(sec_uid: string, count: string, max_cursor: string) {
  return new Promise((resolve, reject) => {
    let _signature
    try {
      _signature = generateSignature(sec_uid)
    } catch(err) {}
    rp({
      method: 'get',
      uri: 'https://www.iesdouyin.com/web/api/v2/aweme/post/',
      qs: {
        sec_uid,
        count,
        max_cursor,
        _signature
      },
      json: true
    }).then((res: any) => {
      resolve({
        has_more: res.has_more,
        max_cursor: res.max_cursor,
        aweme_id_list: res.aweme_list.map((item: any) => ({
          id: item.aweme_id,
          desc: item.desc,
          heart: item.statistics.digg_count,
          coverUrl: item.video.cover.url_list[0]
        }))
      })
    }).catch(reject)
  })
}

/**
 * 通过视频 id 获得视频无水印真实链接
 * @param {string} id 视频 id
 * @returns 视频无水印真实链接
 */
export function getTrueVideoUrl(id: string): Promise<string> {
  return new Promise((resolve, reject) => {
    rp({
      method: 'get',
      uri: 'https://www.douyin.com/web/api/v2/aweme/iteminfo/?item_ids=' + id,
      json: true
    }).then((res: any) => {
      let url = res.item_list[0].video.play_addr.url_list[0]
      const noWaterMarkUrl = url.replace('playwm', 'play')
      resolve(noWaterMarkUrl)
    }).catch(reject)
  })
}

/**
 * 下载视频到本地 /data/${nickname} 文件夹下
 * @param {string} url 视频 url
 */
export function download(url: string, nickname: string, filename='filename') {
  return new Promise((resolve, reject) => {
    let stream = fs.createWriteStream(`./data/${nickname}/${filename}.mp4`);
    request({
      url: url,
      followRedirect: true,
      headers: {
        'User-Agent': 'Request-Promise'
      }
    }).pipe(stream).on('close', () => {
      console.log(filename + ' download success');
      resolve('')
    }).on('error', (err: any) => {
      console.log(err)
      reject(err)
    });
  })
}
// test
// run `npx tsc douyin.ts && node douyin.js`
// parseHomeUrl('https://www.douyin.com/user/MS4wLjABAAAA7pHW32vyOVNmUjzv3ze0Dt_9l-czozeBGzWzxmyCZn_3rbgHa_V5OSjUWPxzJQCx/123')
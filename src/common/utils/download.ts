const { ipcRenderer } = window.require('electron')

import { getTrueVideoUrl } from './douyin'

export const download = (id: string, url: string, fileName: string) => {
  ipcRenderer.send('download', {
    id,
    url, // 下载链接
    fileName // 下载文件名，需要包含后缀名
  })
}

export const downloadSelected = (downloadList: { id: string, desc: string }[]) => {
  let pList: Promise<string>[] = []
  downloadList.forEach((item: { id: string, desc: string }) => {
    pList.push(getTrueVideoUrl(item.id))
  })

  Promise.all(pList).then((res: string[]) => {
    const lst = res.map((item: string, index: number) => {
      return {
        id: downloadList[index].id,
        url: item,
        fileName: downloadList[index].desc.replace(/\s|\r|\r\n|\n/g, '_') + '.mp4'
      }
    })

    ipcRenderer.send('download', lst)
  })
}

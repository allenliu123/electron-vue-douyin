const { ipcMain, dialog, shell } = require('electron')
const path = require('path')
const lodash = require('lodash')
import { DownloadItem } from '../interface/index'

export function initDownload(win) {
  let downLoadQueue: DownloadItem[] = [] // 待下载列表
  // const maxCount: number = 3 // 同时下载个数
  let downloadPath: string = ''
  let downloadItem: DownloadItem = null
  let isWorking: boolean = false // 是否正在下载任务
  // let downloadingList: DownloadItem[] = [null, null, null]

  function push(data: DownloadItem[] | DownloadItem) {
    if (Array.isArray(data)) {
      downLoadQueue = downLoadQueue.concat(data)
      data.forEach((item: DownloadItem) => {
        win.send('downloadingInfo', {
          id: item.id,
          name: item.fileName,
          status: 'waiting',
          progress: 0
        })
      })
    } else {
      downLoadQueue.push(data)
      win.send('downloadingInfo', {
        id: data.id,
        name: data.fileName,
        status: 'waiting',
        progress: 0
      })
    }
  }

  function startDownload() {
    if (downLoadQueue.length === 0) {
      isWorking = false
      return
    }
    isWorking = true
    downloadItem = downLoadQueue.shift();
    console.log(downloadItem)
    if (downloadPath) { // 已经下载过一次
      win.webContents.downloadURL(downloadItem.url)
    } else {
      const filters = getFilter()
        // 弹出另存为弹框，用于获取保存路径
        dialog
        .showSaveDialog(win, {
          filters,
          defaultPath: downloadItem.fileName
        }).then(result => {
          downloadPath = result.filePath.slice(0, result.filePath.lastIndexOf('\\'))
          if (downloadPath) {
            win.webContents.downloadURL(downloadItem.url)
          }
        })
    }
  }

  function getFilter() {
    let ext = path.extname(downloadItem.fileName)
    let filters = [{ name: '全部文件', extensions: ['*'] }]
    if (ext && ext !== '.') {
      filters.unshift({
        name: '',
        extensions: [ext.substring(1)]
      })
    }
    return filters
  }

  // 监听渲染进程发出的download事件
  ipcMain.on('download', (evt, args) => {
    push(args)
    if (!isWorking) {
      startDownload()
    }
  })

  win.webContents.session.on('will-download', (event, item: any) => {
    //设置文件存放位置
    const total = Number(item.getTotalBytes())
    item.setSavePath(downloadPath + '\\' + downloadItem.fileName)
    const obj = lodash.cloneDeep(downloadItem)
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          const received: number = item.getReceivedBytes()
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
          win.send('downloadingInfo', {
            id: obj.id,
            name: obj.fileName,
            status: 'downloading',
            progress: Math.floor((received / total) * 100)
          })
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        win.send('downloadingInfo', {
          id: obj.id,
          name: obj.fileName,
          path: downloadPath + '\\' + obj.fileName,
          status: 'done',
          progress: 100
        })
        startDownload()
        // shell.showItemInFolder(downloadObj.savedPath) // 下载成功后打开文件所在文件夹
      } else {
        win.send('downloadingInfo', {
          id: obj.id,
          name: obj.fileName,
          status: 'error',
          progress: 0
        })
        startDownload()
      }
    })
  })
}

const { ipcMain, dialog, shell } = require('electron')
const path = require('path')

export function initDownload(win) {
  let downloadObj = {
    downloadPath: '', // 要下载的链接或文件
    fileName: '', // 要保存的文件名，需要带文件后缀名
    savedPath: '', // 要保存的路径
    downloadList: []
  }
  function resetDownloadObj() {
    downloadObj = {
      downloadPath: '',
      fileName: '',
      savedPath: '',
      downloadList: []
    }
  }
  // 监听渲染进程发出的download事件
  ipcMain.on('download', (evt, args) => {
    if (Array.isArray(args)) {
      downloadObj.downloadPath = ''
      downloadObj.downloadList = args
    } else {
      downloadObj.downloadPath = args.downloadPath
      downloadObj.fileName = args.fileName
    }
    let ext = path.extname(downloadObj.fileName)
    let filters = [{ name: '全部文件', extensions: ['*'] }]
    if (ext && ext !== '.') {
      filters.unshift({
        name: '',
        extensions: [ext.substring(1)]
      })
    }
    // 弹出另存为弹框，用于获取保存路径
    dialog
      .showSaveDialog(win, {
        filters,
        defaultPath: downloadObj.fileName
      })
      .then((result) => {
        downloadObj.savedPath = result.filePath
        console.log('11', result)
        if (downloadObj.savedPath) {
          if (downloadObj.downloadPath) {
            win.webContents.downloadURL(downloadObj.downloadPath) // 触发will-download事件
          } else { // 多选下载
            downloadObj.downloadList.forEach((item: any) => {
              win.webContents.downloadURL(item.url);
            })
          }
        }
      })
      .catch(() => {})
  })

  win.webContents.session.on('will-download', (event, item) => {
    //设置文件存放位置
    console.log(item.getTotalBytes())
    item.setSavePath(downloadObj.savedPath)
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        shell.showItemInFolder(downloadObj.savedPath) // 下载成功后打开文件所在文件夹
      } else {
        console.log(`Download failed: ${state}`)
      }
      resetDownloadObj()
    })
  })
}

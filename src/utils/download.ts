
const { ipcRenderer } = window.require('electron')

export const download = (url: string, fileName: string) => {
  ipcRenderer.send('download', {
    downloadPath: url, // 下载链接
    fileName // 下载文件名，需要包含后缀名
  })
}
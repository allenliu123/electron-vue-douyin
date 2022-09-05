import { ref } from 'vue'
import { DownloadItem, DownloadedItem } from '@/common/interface/index'
const { ipcRenderer } = window.require('electron')
import moment from 'moment'

export default function useDownload() {

  ipcRenderer.on('downloadingInfo', (e: any, info: any) => {
    const item = downloadingList.value.find(item => item.id === info.id)
    if (item) {
      item.progress = info.progress
      item.status = info.status
      if (info.status === 'done') {
        const downloadedItem: DownloadedItem = Object.assign({}, info, {
          path: info.path,
          datetime: moment().format('YYYY-MM-DD hh:mm:ss')
        })
        addToDownloaded(downloadedItem)
        downloadingList.value = downloadingList.value.filter(item => item.id !== info.id)
      }
    } else {
      downloadingList.value.push(info)
    }
  })

  const addToDownloaded = (downloadedItem: DownloadedItem) => {
    if (downloadedList.value.find(item => item.id === downloadedItem.id)) {
      return
    }
    downloadedList.value.push(downloadedItem)
  }

  const downloadingList = ref<DownloadItem[]>([])
  const downloadedList = ref<DownloadedItem[]>([])

  return {
    downloadingList,
    downloadedList
  }
}
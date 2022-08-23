import { ref } from 'vue'
import { DownloadItem, DownloadedItem } from '@/common/interface/index'
const { ipcRenderer } = window.require('electron')
import moment from 'moment'

export default function useDownload() {
  const active = ref<boolean>(false)

  const onDownloadBoxImgClick = () => {
    active.value = !active.value
  }

  ipcRenderer.on('downloadingInfo', (e, info) => {
    console.log(info)
    const item = downloadingList.value.find(item => item.id === info.id)
    if (item) {
      item.progress = info.progress
      if (info.progress === 100) {
        const downloadedItem: DownloadedItem = {
          id: info.id,
          name: info.name,
          path: info.path,
          datetime: moment().format('YYYY-MM-DD hh:mm:ss')
        }
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
    active,
    onDownloadBoxImgClick,
    downloadingList,
    downloadedList
  }
}
import { ref } from 'vue'
import { DownloadItem, DownloadedItem } from '@/common/interface/index'
const { ipcRenderer } = window.require('electron')

export default function useDownload() {
  const active = ref<boolean>(false)

  const onDownloadBoxImgClick = () => {
    active.value = !active.value
  }

  ipcRenderer.on('downloadingInfo', (e, info) => {
    console.log(info)
    let find = false
    const item = downloadingList.value.find(item => item.id === info.id)
    if (item) {
      item.progress = info.progress
    } else {
      downloadingList.value.push(info)
    }
  })

  const downloadingList = ref<DownloadItem[]>([])

  const downloadedList = ref<DownloadedItem[]>([{
    name: '123.mp4',
    datetime: '2022-08-25 14:32'
  }])

  return {
    active,
    onDownloadBoxImgClick,
    downloadingList,
    downloadedList
  }
}
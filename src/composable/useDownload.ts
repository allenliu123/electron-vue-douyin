import { ref } from 'vue'
import { DownloadItem, DownloadedItem } from '@/common/interface/index'

export default function useDownload() {
  const active = ref<boolean>(false)

  const onDownloadBoxImgClick = () => {
    active.value = !active.value
  }

  const downloadingList = ref<DownloadItem[]>([{
    name: '11312.mp4',
    progress: 10
  }, {
    name: '3s.mp4',
    progress: 20
  }])

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
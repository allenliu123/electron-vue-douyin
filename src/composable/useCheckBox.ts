import { useMessage } from 'naive-ui'
import { ref, Ref, watchEffect } from 'vue'
import { downloadSelected } from '../common/utils/download'

export default function useCheckBox(videoList: Ref) {
  const allCheck = ref<boolean>(false)
  const indeterminate = ref<boolean>(false)
  const selectIds = ref<{ id: string, desc: string }[]>([]);

  watchEffect(() => {
    selectIds.value = videoList.value.filter((item: any) => item.checked).map((item: any) => ({ id: item.id, desc: item.desc }))
  })

  const message = useMessage()

  const onClickDownload = () => {
    downloadSelected(selectIds.value)
    message.success(`已建立 ${ selectIds.value.length } 个下载任务，下载进度请点击右下角查看`)
    clear()
  }

  function clear() {
    videoList.value.forEach(item => {
      item.checked = false
    })
  }

  return {
    allCheck,
    indeterminate,
    selectIds,
    onClickDownload
  }
}

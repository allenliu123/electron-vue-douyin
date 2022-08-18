import { ref, Ref, watchEffect } from 'vue'
import { downloadSelected } from '../common/utils/download'

export default function useCheckBox(videoList: Ref) {
  const allCheck = ref<boolean>(false)
  const indeterminate = ref<boolean>(false)
  const isSelected = ref<string[]>([])
  const selectIds = ref<{ id: string, desc: string }[]>([]);

  watchEffect(() => {
    selectIds.value = videoList.value.filter((item: any) => item.checked).map((item: any) => ({ id: item.id, desc: item.desc }))
  })

  const onClickDownload = () => {
    downloadSelected(selectIds.value)
  }

  return {
    allCheck,
    indeterminate,
    isSelected,
    selectIds,
    onClickDownload
  }
}

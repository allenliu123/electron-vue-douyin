<script setup lang="ts">
import { computed } from 'vue';
import useDownload from '@/composable/useDownload';
import { openFile } from '@/common/utils/file'

const {
  downloadingList,
  downloadedList
} = useDownload()
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:active'])
const modelActive = computed({
  get() {
    return props.active
  },
  set(newValue) {
    console.log(newValue)
    emit('update:active', newValue)
  }
})
</script>

<template>
  <div>
    <n-drawer v-model:show="modelActive" :width="400" placement="right">
      <n-drawer-content>
        <n-tabs type="line" animated>
          <n-tab-pane name="downloading" tab="下载中">
            <div class="list-item" v-for="item in downloadingList">
              <div>{{ item.name }}</div>
              <n-progress type="line" :percentage="item.progress" />
            </div>
          </n-tab-pane>
          <n-tab-pane name="downloaded" tab="已下载">
            <div class="list-item" v-for="item in downloadedList">
              <div class="flex-between">
                <div style="flex: 1;">
                  <div style="font-weight: bold;">{{ item.name }}</div>
                  <div style="font-size: 12px;">{{ item.datetime }}</div>
                </div>
                <div class="floder-icon">
                  <img src="@/assets/folder.png" alt="" @click="() => openFile(item.path)" />
                </div>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style lang="less" scoped>
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-item {
  margin: 10px 0;
}
.floder-icon {
  width: 24px;
  height: 24px;
  margin-left: 20px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
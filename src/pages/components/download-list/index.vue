<script setup lang="ts">
import { ref } from 'vue';
import useDownload from '@/composable/useDownload';
import { openFile } from '@/common/utils/file'

const {
  downloadingList,
  downloadedList
} = useDownload()

const active = ref<boolean>(false)

const map = new Map([
  ['error', '错误'],
  ['waiting', '等待中'],
  ['downloading', '下载中'],
  ['done', '完成']
])
</script>

<template>
  <div>
    <div class="download-box">
      <n-badge :value="downloadingList.length" :max="15">
        <img src="@/assets/download-box.png" alt="" @click="active = true">
      </n-badge>
    </div>
    <n-drawer v-model:show="active" :width="400" placement="right">
      <n-drawer-content>
        <n-tabs type="line" animated>
          <n-tab-pane name="downloading" tab="下载中">
            <div v-if="downloadingList.length === 0">
              <div style="text-align: center;">空空如也</div>
            </div>
            <div class="list-item" v-for="item in downloadingList">
              <div>{{ item.name }}</div>
              <n-progress type="line" :percentage="item.progress">{{ map.get(item.status) }}</n-progress>
            </div>
          </n-tab-pane>
          <n-tab-pane name="downloaded" tab="已下载">
            <div v-if="downloadedList.length === 0">
              <div style="text-align: center;">空空如也</div>
            </div>
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
.download-box {
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  img {
    width: 48px;
    height: 48px;
  }
}
</style>
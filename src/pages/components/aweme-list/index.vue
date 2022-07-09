<script setup lang="ts">
import { ref, defineProps, toRefs, watchEffect } from 'vue'
import downloadPng from '../../../assets/download.png'
import {
  getVideoList
} from '../../../utils/douyin'
const videoList = ref<any>([])
const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})

const { info } = toRefs<any>(props);

watchEffect(() => {
  getVideoList(info.value.sec_uid, info.value.aweme_count, info.value.extraNow).then((res: any) => {
    videoList.value = res.aweme_id_list
  })
})

</script>

<template>
  <div class="container">
    <div v-for="(item, index) in videoList" :key="item.id">
      <div class="video-item" :class="{ mlef: index % 3 !== 0 }">
        <img class="cover-url" :src="item.coverUrl" alt="">
        <div class="mask">
          <img class="download-icon" :src="downloadPng" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 20px;
  display: flex;
  flex-flow: wrap;
  justify-content: left;
}
.video-item {
  position: relative;
}
.video-item:hover .mask {
  opacity: 1;
}
.mask {
  opacity: 0;
  position: absolute;
  right: 10px;
  bottom: 10px;
  transition: opacity 0.5s ease;
}
.cover-url {
  width: 170px;
  height: 300px;
  object-fit: cover;
}
.download-icon {
  width: 34px;
  height: 34px;
  cursor: pointer;
}
.mlef {
  margin-left: 20px;
}
</style>

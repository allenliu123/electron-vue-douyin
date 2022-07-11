<script setup lang="ts">
import { ref, defineProps, toRefs, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import downloadPng from '../../../assets/download.png'
import {
  getVideoList,
  getTrueVideoUrl,
  download as downloadOne
} from '../../../utils/douyin'
const fs = require('fs');

const videoList = ref<any>([])
const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})

const { info } = toRefs<any>(props);
const isLoading = ref<boolean>(false)
const hasMore = ref<boolean>(false)
const loadAll = ref<boolean>(false)
const max_cursor = ref<string>('')
const isLoadErr = ref<boolean>(false)

let timer: any = undefined
const handleScroll = function(e: any) {
  timer && clearTimeout(timer)
  timer = setTimeout(() => {
    const { scrollTop, clientHeight, scrollHeight } = e.target
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      // 触底
      console.log('触底')
      loadMore()
    }
  }, 200)
}

const getData = (cursor: string) => {
  if (isLoading.value || loadAll.value) {
    return
  }
  isLoading.value = true
  getVideoList(info.value.sec_uid, info.value.aweme_count, cursor).then((res: any) => {
    videoList.value = videoList.value.concat(res.aweme_id_list)
    hasMore.value = res.has_more
    max_cursor.value = res.max_cursor
    if (!res.has_more) {
      loadAll.value = true
    }
    isLoading.value = false
  }).catch(err => {
    isLoading.value = false
    isLoadErr.value = true
  })
}

const reLoad = () => {
  loadMore()
}

onMounted(() => {
  getData(info.value.extraNow)
})

const message = useMessage()
const download = async (id: string, nickname: string, desc: string) => {
  nickname = nickname.replace(/\s|\r|\r\n|\n/g, '-')
  const url: string = await getTrueVideoUrl(id)
  if (!fs.existsSync('./data/' + nickname)) {
    fs.mkdirSync('./data/' + nickname)
  }
  message.info('视频文件下载中...')
  await downloadOne(url, nickname, desc.replace(/\s|\r|\r\n|\n/g, '-'))
  message.success(`视频文件已经下载到项目根目录 data/${nickname} 文件夹下`)
}

function loadMore() {
  if (!hasMore) {
    loadAll.value = true
    return
  }
  getData(max_cursor.value)
}

</script>

<template>
  <div>
    <div class="header">
      <div>共 {{ props.info.aweme_count }} 个作品</div>
      <ShowType class="show-type" :type="1" width="20px"></ShowType>
    </div>
    <div class="container" @scroll="handleScroll">
      <div v-for="(item, index) in videoList" :key="item.id">
        <div class="video-item" :class="{ mlef: index % 3 !== 0 }">
          <img class="cover-url" :src="item.coverUrl" alt="">
          <div class="mask">
            <img class="download-icon" @click="() => download(item.id, info.nickname, item.desc)" :src="downloadPng" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="loading-box">
      <div class="loading" v-show="isLoading">加载中...</div>
      <div class="loading" v-show="loadAll">已加载全部</div>
      <div class="loading pointer" v-show="isLoadErr" @click="reLoad">加载错误，点击重试</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.container {
  height: calc(100vh - 194px);
  overflow: auto;
  margin: 0 20px;
  display: flex;
  flex-flow: wrap;
  justify-content: left;
}
.header {
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    font-size: 1.4em;
    font-weight: bold;
    line-height: 60px;
  }
}
.pointer {
  cursor: pointer;
}
.loading-box {
  height: 30px;
  .loading {
    line-height: 30px;
    text-align: center;
  }
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

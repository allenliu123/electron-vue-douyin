<script setup lang="ts">
  import { ref } from 'vue'
  import { useMessage } from 'naive-ui'
  import AwemeList from './components/aweme-list/index.vue'
  import {
    getUserInfo,
    parseHomeUrl
  } from '@/common/utils/douyin'

  const message = useMessage()
  const searchValue = ref<string>('https://www.douyin.com/user/MS4wLjABAAAA7pHW32vyOVNmUjzv3ze0Dt_9l-czozeBGzWzxmyCZn_3rbgHa_V5OSjUWPxzJQCx')
  const userInfo = ref<any>({
    sec_uid: '',
    nickname: '',
    signature: '', // 个性签名
    avatar_url: '', // 头像地址
    following_count: 0, // 关注
    mplatform_followers_count: 0, // 粉丝
    total_favorited: '0', // 获赞
    aweme_count: 0, // 作品数
    extraNow: ''
  })
  const search = async () => {
    const sec_uid = parseHomeUrl(searchValue.value)
    if (!sec_uid) {
      message.error('地址解析错误')
      return
    }
    const { info, extraNow } = await getUserInfo(sec_uid)
    userInfo.value = {
      sec_uid: info.sec_uid,
      nickname: info.nickname,
      signature: info.signature, // 个性签名
      avatar_url: 'https://p3-pc.douyinpic.com/aweme/100x100/' + info.avatar_larger.uri, // 头像地址
      following_count: info.following_count, // 关注
      mplatform_followers_count: info.mplatform_followers_count, // 粉丝
      total_favorited: info.total_favorited, // 获赞
      aweme_count: info.aweme_count, // 作品数
      extraNow: extraNow
    }
  }
</script>

<template>
  <div class="page">
    <div class="search-douyin">
      <n-input class="ipt" v-model:value="searchValue" type="text" placeholder="基本的 Input" />
      <n-button
        @click="search"
        class="btn"
        color="#8a2be2">
        搜索
      </n-button>
    </div>
    <div class="user-info" v-if="userInfo.nickname">
      <div class="left">
        <div class="avatar">
          <n-avatar
            round
            :size="64"
            :src="userInfo.avatar_url"
          />
          <div class="nickname">{{ userInfo.nickname }}</div>
          <div class="signature">{{ userInfo.signature }}</div>
        </div>
        <div class="info">
          <div>关注 {{userInfo.following_count}}</div>
          <div>粉丝 {{userInfo.mplatform_followers_count}}</div>
          <div>获赞 {{userInfo.total_favorited}}</div>
        </div>
      </div>
      <div class="right">
        <aweme-list
          :info="userInfo"
        ></aweme-list>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page {
  width: 95%;
  margin: 0 auto;
  color: white;
}
.search-douyin {
  width: 80%;
  margin: 0 auto;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  .ipt {
    flex: 1;
  }
  .btn {
    margin-left: 20px;
  }
}
.user-info {
  margin-top: 20px;
  display: flex;
  .left {
    background-color: #78909032;
    border-radius: var(--card-border-radius);
    padding: 20px;
    width: 300px;
    .avatar {
      text-align: center;
    }
    .nickname {
      font-size: 1.3em;
      font-weight: bold;
    }
    .signature {
      width: 70%;
      margin: 0 auto;
    }
    .info {
      display: flex;
      justify-content: space-around;
    }
  }
  .right {
    overflow: auto;
    margin-left: 20px;
    background-color: #78909032;
    border-radius: var(--card-border-radius);
    flex: 1;
  }
}
</style>

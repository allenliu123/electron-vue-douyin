<script setup lang="ts">
import home from './pages/home.vue'
import { darkTheme } from 'naive-ui'
import { themeOverrides } from '@/common/style/themeOverrides'
</script>

<template>
  <div class="container">
    <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
      <n-message-provider>
        <home></home>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<style>
:root {
  --darkreader-container-background: linear-gradient(180deg, #08091b 80%, rgba(8, 9, 27, 1));
  --card-border-radius: 6px;
}
html {
  background: var(--darkreader-container-background)
}
</style>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
</style>

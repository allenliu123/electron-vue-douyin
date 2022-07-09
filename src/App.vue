<script setup lang="ts">
import home from './pages/home.vue'
</script>

<template>
  <div class="container">
    <n-message-provider>
      <home></home>
    </n-message-provider>
  </div>
</template>

<style>
:root {
  --darkreader-bgimg--container-background: linear-gradient(180deg, #08091b 80%, rgba(8, 9, 27, 1));
}
#app {
  height: 100vh;
  background: var(--darkreader-bgimg--container-background)
}
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
</style>

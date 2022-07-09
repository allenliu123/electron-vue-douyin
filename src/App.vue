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

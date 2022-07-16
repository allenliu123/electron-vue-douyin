<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import show1 from '../assets/show1.png'
import show2 from '../assets/show2.png'

const props = defineProps({
  width: {
    type: String,
    default: () => '40px'
  },
  show: {
    type: Number,
    default: () => 1
  }
})

const src = ref<string>(show1)

watchEffect(() => {
  console.log(props.show)
  src.value = props.show === 1 ? show1 : show2
})

const toggle = () => {
  src.value = src.value === show1 ? show2 : show1
}

</script>

<template>
  <div class="cursor: pointer">
    <img :style="{
      width: props.width
    }" :src="src" @click="toggle">
  </div>
</template>
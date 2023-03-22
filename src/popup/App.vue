<template>
  <div class="wrap">
    {{ val }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MessageUtils from '@/class/message'
import polyfill from 'webextension-polyfill'
const val = ref()
new MessageUtils()
polyfill.runtime
  .sendMessage(polyfill.runtime.id, {
    type: 'init',
  })
  .then(res => (val.value = res))

// const style = document.createElement('link')
// style.href = chrome.runtime.getURL(
//   chrome.runtime.getManifest().content_scripts[0].css[0]
// )
// style.rel = "stylesheet"
// document.querySelector('')
// nextTick(() => {
//  style.value = chrome.runtime.getManifest().content_scripts[0].css[0]
// })
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

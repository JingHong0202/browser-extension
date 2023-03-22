<template>
  <div id="wrap">
    {{ val }}
  </div>
  <!-- <style :src="style"></style> -->
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import MessageUtils from '@/class/message'
import polyfill from 'webextension-polyfill'
const val = ref(),
style = ref()
new MessageUtils()
polyfill.runtime
  .sendMessage(polyfill.runtime.id, {
    type: 'init',
  })
  .then(res => (val.value = res))
// nextTick(() => {
//  style.value = chrome.runtime.getManifest().content_scripts[0].css[0]
// })
</script>

<style lang="scss" scoped>
div {
  width: 100%;
  height: 100%;
}
</style>

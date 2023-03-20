<template> 
</template>

<script setup lang="ts">
import MessageUtils from '@/class/message'
import polyfill from 'webextension-polyfill'

new MessageUtils();
// polyfill.runtime.sendMessage(
//   polyfill.runtime.id,
//   {
//     type: 'init',
//   }
 
// ).then(res => console.log(res))
</script>

<style lang="scss"></style>

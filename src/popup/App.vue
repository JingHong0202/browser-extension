<template>
	<div class="wrap">
		{{ bookmark_tree }}
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MessageUtils from '@/class/message'
import polyfill from 'webextension-polyfill'
import { TypeList } from '@/types/bookmark'

const bookmark_tree = ref<polyfill.Bookmarks.BookmarkTreeNode[]>([])
const message = new MessageUtils<
	TypeList<polyfill.Bookmarks.BookmarkTreeNode[]>
>()

message
	.sendMessage({ type: 'init', to: 'background' })!
	.then(res => (bookmark_tree.value = res))

message.eventsHandler.on('message', ({ type, data }) => {
	bookmark_tree.value = data
})
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

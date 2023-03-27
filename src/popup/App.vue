<template>
	<div class="wrap">
		<input type="text" :value="input" @input="change" />
		{{ search_tree }}
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MessageUtils from '@/class/message'
import polyfill from 'webextension-polyfill'
import { TypeList } from '@/types/bookmark'

const bookmark_tree = ref<polyfill.Bookmarks.BookmarkTreeNode[]>([]),
	search_tree = ref<polyfill.Bookmarks.BookmarkTreeNode[]>([]),
	input = ref(''),
	message = new MessageUtils<TypeList<polyfill.Bookmarks.BookmarkTreeNode[]>>()

message
	.sendMessage({ type: 'init', to: 'background' })!
	.then(res => (bookmark_tree.value = res))

message.eventsHandler.on<TypeList<polyfill.Bookmarks.BookmarkTreeNode[]>>(
	'message',
	({ type, data }) => {
		bookmark_tree.value = data
	}
)

async function change(e: Event) {
	input.value = (e.target as HTMLInputElement).value
	const response = <polyfill.Bookmarks.BookmarkTreeNode[]>(
		await message.sendMessage({
			to: 'background',
			type: 'search',
			data: input.value
		})
	)

	if (!response?.length) return
	search_tree.value = response
}
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

import { Ref, ref, watchEffect } from 'vue'
import MessageUtils from '@/class/message'
import polyfill from 'webextension-polyfill'
import { TypeList } from '@/types/bookmark'

export function useFetch(input: Ref<string>) {
	const bookmark_tree = ref<polyfill.Bookmarks.BookmarkTreeNode[]>([]),
		search_tree = ref<polyfill.Bookmarks.BookmarkTreeNode[]>([]),
		message = new MessageUtils<
			TypeList<polyfill.Bookmarks.BookmarkTreeNode[]>
		>()

	message
		.sendMessage({ type: 'init', to: 'background' })!
		.then(res => (bookmark_tree.value = res))

	message.eventsHandler.on<TypeList<polyfill.Bookmarks.BookmarkTreeNode[]>>(
		'message',
		({ type, data }) => {
			bookmark_tree.value = data
		}
	)

  watchEffect(change)

	async function change() {
		// input.value = (e.target as HTMLInputElement).value
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

	return { bookmark_tree, search_tree }
}

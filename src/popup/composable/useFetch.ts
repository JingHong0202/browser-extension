import { Ref, ref, watch } from 'vue'
import MessageUtils from '@/class/message'
import polyfill from 'webextension-polyfill'
import { TypeList } from '@/types/bookmark'
import { debounce } from '@/utils/index'

export function useFetch(input: Ref<string>) {
	const bookmark_tree = ref<polyfill.Bookmarks.BookmarkTreeNode[]>([]),
		search_tree = ref<polyfill.Bookmarks.BookmarkTreeNode[]>([]),
		message = new MessageUtils<
			TypeList<polyfill.Bookmarks.BookmarkTreeNode[]>
		>()

	message
		.sendMessage({ type: 'init', to: 'background' })!
		.then(res => (bookmark_tree.value = res))
	console.log(bookmark_tree)
	message.eventsHandler.on<TypeList<polyfill.Bookmarks.BookmarkTreeNode[]>>(
		'message',
		({ type, data }) => {
			bookmark_tree.value = data
		}
	)
	watch(
		input,
		debounce(async () => {
			const response = <polyfill.Bookmarks.BookmarkTreeNode[]>(
				await message.sendMessage({
					to: 'background',
					type: 'search',
					data: input.value
				})
			)

			// const filter = response.filter(bookmark => bookmark.url)

			// if (!response?.length) return
			search_tree.value = response.filter(bookmark => bookmark.url)
		}, 200)
	)

	return { bookmark_tree, search_tree, message }
}

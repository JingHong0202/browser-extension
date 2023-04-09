import BookMarkUtils from '@/class/bookmark'
import polyfill from 'webextension-polyfill'

const _bookmark = new BookMarkUtils()

polyfill.commands.onCommand.addListener(command => {
	if (command === 'show-search-input') {
		_bookmark.sendMessage({ to: 'content', type: 'command', data: command })
	}
})

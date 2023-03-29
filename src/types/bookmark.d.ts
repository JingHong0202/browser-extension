import polyfill from 'webextension-polyfill'

export type TypeList<T> = {
	type: BookMarkAction
	data: T
}

export type BookMarkAction = 'changed' | 'remove' | 'created' | 'move' | 'init' | 'search' | 'command' | 'select'

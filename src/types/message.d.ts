export type SendOptions<T> = {
	type: string
	data?: T
	to: 'content' | 'background'
}

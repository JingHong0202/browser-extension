function debounce(callback: (...args: any[]) => void, time = 1000) {
	let timer: number
	return function (...args: []) {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			callback(...args)
		}, time)
	}
}

export { debounce }

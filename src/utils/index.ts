function debounce(callback: (...args: any[]) => void, time = 1000) {
	let timer: number
	return function () {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			callback()
		}, time)
	}
}

export { debounce }

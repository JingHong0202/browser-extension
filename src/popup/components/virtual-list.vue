<template>
	<div
		class="virtual-list-wrap"
		ref="wrap"
		@scroll.prevent.stop="wrapScrollHandler">
		<div
			class="virtual-list-placeholder"
			:style="{ height: placeholderHeight + 'px' }"></div>
		<div
			class="virtual-list-container"
			:style="{ transform: `translate3d(0,${startOffset}px,0)` }">
			<div
				class="virtual-item"
				v-for="item in visibleData"
				:_id="item.__index"
				:key="item[props.keyName]">
				<slot :slotScope="item" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onUpdated, ref, watchEffect } from 'vue'

const props = withDefaults(
	defineProps<{
		data: any[]
		itemSize: number
		buffer: number
		keyName: string
	}>(),
	{
		itemSize: 0,
		buffer: 0,
		keyName: ''
	}
)

const wrap = ref<HTMLDivElement>(),
	// items = ref<HTMLDivElement[]>(),
	_data = ref<any[]>([]),
	placeholderHeight = computed(() => {
		return _data.value[_data.value.length - 1]?.__bottom
	}),
	visibleCount = computed(() => {
		return Math.ceil((wrap.value?.clientHeight ?? 0) / props.itemSize)
	}),
	aboveCount = computed(() => {
		return Math.min(
			startIndex.value,
			Math.round(props.buffer * visibleCount.value)
		)
	}),
	belowCount = computed(() => {
		return Math.min(
			_data.value.length - endIndex.value,
			Math.round(props.buffer * visibleCount.value)
		)
	}),
	visibleData = computed(() => {
		const start = startIndex.value - aboveCount.value,
			end = endIndex.value + belowCount.value
		// console.log(start, end)
		return _data.value.slice(start, end + 1)
	}),
	startIndex = ref(0),
	endIndex = computed(() => startIndex.value + visibleCount.value),
	startOffset = computed(() => {
		if (startIndex.value >= 1) {
			const size =
				_data.value[startIndex.value].__top -
				(_data.value[startIndex.value - aboveCount.value]
					? _data.value[startIndex.value - aboveCount.value].__top
					: 0)
			return _data.value[startIndex.value - 1].__bottom - size
		} else {
			return 0
		}
	})

defineExpose({
	reset,
	container: wrap,
	_data
})

watchEffect(() => {
	_data.value = !props.data?.length
		? []
		: props.data.map((item, index) => {
				return {
					...item,
					...initPositions(index)
				}
		  })
})

onUpdated(() => {
	const children = wrap.value?.querySelectorAll(
		'.virtual-list-container > .virtual-item'
	)

	if (children === undefined) return
	nextTick(() => {
		for (let index = 0; index < children.length; index++) {
			const element = children[index]
			const rect = element.getBoundingClientRect(),
				id = +element.getAttribute('_id')!,
				oldHeight = _data.value[id].__height,
				dVal = oldHeight - rect.height

			if (dVal) {
				_data.value[id].__height = rect.height
				_data.value[id].__bottom = _data.value[id].__bottom - dVal
				for (
					let index_below = id + 1;
					index_below < _data.value.length;
					index_below++
				) {
					const element_below = _data.value[index_below]
					element_below.__top = _data.value[index_below - 1].__bottom
					element_below.__bottom = element_below.__bottom - dVal
				}
			}
		}
	})
})

function initPositions(index: number) {
	return {
		__height: props.itemSize,
		__bottom: (index + 1) * props.itemSize,
		__top: index * props.itemSize,
		__index: index
	}
}
function wrapScrollHandler() {
	const scrollTop = wrap.value!.scrollTop
	startIndex.value = binarySearch(_data.value, scrollTop)
	// console.log(_data.value.find(
	// 	item => item?.__bottom > scrollTop
	// )?.__index)
	// console.log(scrollTop, startIndex.value, _data.value)
	// startOffset.value = scrollTop - (scrollTop % props.itemSize)
}

function binarySearch(searchList: any[], findVal: number) {
	let start = 0,
		end = searchList.length - 1,
		tempIndex = null

	while (start <= end) {
		const mid = start + ((end - start) >> 1)
		if (searchList[mid].__bottom > findVal) {
			if (tempIndex === null || tempIndex > mid) {
				tempIndex = mid
			}
			end = end - 1
		} else if (searchList[mid].__bottom < findVal) {
			start = mid + 1
		} else if (searchList[mid].__bottom === findVal) {
			return searchList[mid].__index + 1
		}
	}
	return tempIndex
}

function reset() {
	startIndex.value = 0
	wrap.value?.scroll({ top: 0, left: 0 })
}
</script>

<style lang="scss" scoped>
.virtual-list-wrap {
	width: inherit;
	height: inherit;
	position: relative;
	overflow-y: auto;
	height: 100%;
	-webkit-overflow-scrolling: touch;
	.virtual-list-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}
	.virtual-list-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		// height: 100%;
		// display: flex;
		// flex-direction: column;
	}
}
</style>

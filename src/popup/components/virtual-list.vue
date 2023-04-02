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
				ref="items"
				v-for="item in visibleData"
				:_id="item.__index"
				:key="item[props.keyName]">
				<slot :slotScope="item" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUpdated, ref, watchEffect } from 'vue'

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

defineExpose({
	reset
})

const wrap = ref<HTMLDivElement>(),
	items = ref<HTMLDivElement[]>(),
	_data = ref<any[]>([]),
	placeholderHeight = computed(() => {
		return _data.value[_data.value.length - 1]?.__bottom
	}),
	visibleCount = computed(() => {
		return Math.ceil((wrap.value?.clientHeight ?? 0) / props.itemSize)
	}),
	visibleData = computed(() => {
		const start =
				startIndex.value -
				Math.min(startIndex.value, props.buffer * visibleCount.value),
			end =
				endIndex.value +
				Math.min(
					_data.value.length - endIndex.value,
					props.buffer * visibleCount.value
				)
		// console.log(start, end)
		return _data.value.slice(start, end)
	}),
	startIndex = ref(0),
	endIndex = computed(() => startIndex.value + visibleCount.value),
	startOffset = computed(() => {
		return startIndex.value >= 1 ? _data.value[startIndex.value].__bottom : 0
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
	// console.log(_data.value)
	// console.log(wrap.value?.querySelector('.virtual-list-container'))
})

onUpdated(() => {
	const children = items.value

	if (children === undefined) return
	// for (let index = 0; index < children.length; index++) {
	// 	const element = children[index]
	// 	const rect = element.getBoundingClientRect(),
	// 		id = +element.getAttribute('_id')!,
	// 		oldHeight = _data.value[id].__height,
	// 		dVal = rect.height - oldHeight

	// 	if (dVal) {
	// 		const current = _data.value[id]
	// 		current.__height = rect.height
	// 		current.__bottom = current.__bottom - dVal
	// 		for (
	// 			let index_below = id + 1;
	// 			index_below < _data.value.length;
	// 			index_below++
	// 		) {
	// 			const element_below = _data.value[index_below]
	// 			element_below.__top = current.__bottom
	// 			element_below.__bottom = element_below.__bottom - dVal
	// 		}
	// 	}
	// }

	children.forEach(node => {
		const rect = node.getBoundingClientRect()
		const height = rect.height
		const index = +node.getAttribute('_id')
		const oldHeight = _data.value[index].height
		const dValue = oldHeight - height
		//存在差值
		if (dValue) {
			_data.value[index].bottom = _data.value[index].bottom - dValue
			_data.value[index].height = height

			for (let k = index + 1; k < _data.value.length; k++) {
				_data.value[k].top = _data.value[k - 1].bottom
				_data.value[k].bottom = _data.value[k].bottom - dValue
			}
		}
	})
	// ;[...children].forEach(item => {

	// })
})

function initPositions(index: number) {
	return {
		__height: props.itemSize,
		__bottom: (index + 1) * props.itemSize,
		__top: index * props.itemSize,
		__index: index
	}
}
function wrapScrollHandler(e: UIEvent) {
	const scrollTop = wrap.value!.scrollTop
	startIndex.value = _data.value.find(
		item => item?.__bottom > scrollTop
	)?.__index
	console.log(scrollTop, startIndex.value, _data.value)
	// startOffset.value = scrollTop - (scrollTop % props.itemSize)
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

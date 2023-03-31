<template>
	<div class="virtual-list-wrap" ref="wrap" @scroll="wrapScrollHandler">
		<div
			class="virtual-list-placeholder"
			:style="{ height: wrapHeight + 'px' }"></div>
		<div class="virtual-list-container">
			<slot />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(
	defineProps<{ data: unknown[]; itemSize: number }>(),
	{
		itemSize: 0
	}
)

const wrap = ref<HTMLDivElement>(),
	wrapHeight = computed(() => {
		return props.data.length * props.itemSize
	}),
	visibleCount = computed(() => {
		return Math.ceil(props.itemSize / wrapHeight.value)
	}),
	startIndex = ref(0),
	endIndex = computed(() => startIndex.value + visibleCount.value)
// onMounted(() => {
// wrap.value?.addEventListener('scroll', )
// })

function wrapScrollHandler(e: UIEvent) {
	const scrollTop = wrap.value!.scrollTop
	startIndex.value = Math.floor(scrollTop / props.itemSize)

	console.log(startIndex.value, endIndex.value)
}
</script>

<style lang="scss" scoped>
.virtual-list-wrap {
	width: inherit;
	height: inherit;
	position: relative;
	overflow-y: auto;
	&-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}
	&-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
    display: flex;
    flex-direction: column;
	}
}
</style>

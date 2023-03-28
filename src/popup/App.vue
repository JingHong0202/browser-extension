<template>
	<div
		class="wrap"
		:class="{ hover: show }"
		:style="{ display: !isTransitionEnd ? 'flex' : 'none' }"
		@transitionend="transitionEnd">
		<div class="inputbox">
			<input required class="input-content" type="text" v-model="input" />
			<span class="label">Search Bookmark</span>
			<i class="line"></i>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from './composable/useFetch'
import { debounce } from '@/utils/index'
const input = ref(''),
	show = ref(false),
	isTransitionEnd = ref(true)
const { search_tree, bookmark_tree, message } = useFetch(input)
const screen = ref(
	Math.max(
		window.document.documentElement.offsetWidth,
		window.document.documentElement.offsetHeight
	) * 2.9
)
window.onresize = () => {
	screen.value =
		Math.max(
			window.document.documentElement.offsetWidth,
			window.document.documentElement.offsetHeight
		) * 2.9
}
message.eventsHandler.on<{ type: 'command'; data: string }>(
	'command',
	({ data }) => {
		if (data === 'show-search-input') {
			show.value = !show.value
			isTransitionEnd.value = false
		}
	}
)
const transitionEnd = debounce((e: TransitionEvent) => {
	if (!show.value) isTransitionEnd.value = true
})
</script>

<style lang="scss" scoped>
.inputbox {
	position: relative;
	width: 60%;
	transition: opacity 0.3s;
	// transition-delay: 0.2s;
	opacity: 0;

	.line {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		background: #45f3ff;
		border-radius: 4px;
		transition: 0.5s;
		pointer-events: none;
		z-index: 9;
	}
	.input-content {
		position: relative;
		width: 100%;
		padding: 15px 10px;
		box-sizing: border-box;
		background: transparent;
		outline: none;
		box-shadow: none;
		border: none;
		color: #23242a;
		font-size: 1em;
		letter-spacing: 0.05em;
		transition: 0.5s;
		z-index: 10;
		&:focus,
		&:valid {
			~ .label {
				color: #45f3ff;
				transform: translateX(-10px) translateY(-34px);
				font-size: 0.75em;
			}
			~ .line {
				height: 44px;
			}
		}
	}
	.label {
		position: absolute;
		left: 0;
		padding: 20px 10px 10px;
		font-size: 1em;
		color: #8f8f8f;
		letter-spacing: 00.05em;
		transition: 0.5s;
		top: 0;
		pointer-events: none;
	}
}

.wrap {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	&::before {
		position: absolute;
		left: 0;
		bottom: 0;
		content: '';
		border-radius: 100%;
		display: block;
		width: 1px;
		height: 1px;
		// text-align: center;
		transition: transform 0.3s, background-color 1s ease-out;
		background: rgba(0, 0, 0, 0);
		transform-origin: center center;
		z-index: -1;
		transform: scale(1);
	}

	&::after {
		position: absolute;
		left: 0;
		bottom: 0;
		content: '';
		border-radius: 100%;
		display: block;
		width: 1px;
		height: 1px;
		transition: transform 0.7s, background-color 1s ease-out;
		// transition-delay: 0.1s;
		background: rgba(0, 0, 0, 0);
		transform-origin: center center;
		z-index: -1;
		transform: scale(1);
	}
	&.hover .inputbox {
		opacity: 1;
	}
	&.hover::before,
	&.hover::after {
		background: rgb(43, 43, 43);
		transform: scale(v-bind('screen'));
	}
}
</style>

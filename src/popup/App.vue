<template>
	<div
		class="wrap"
		:class="{ hover: show }"
		:style="{ visibility: isExists ? 'hidden' : 'unset' }"
		@transitionend.stop="transitionEnd">
		<div class="inputbox">
			<input
				ref="inputEle"
				required
				autofocus
				class="input-content"
				type="text"
				v-show="!isExists"
				@keydown.down.up.prevent="keypress"
				@keydown.enter.prevent="confirm"
				v-model="input" />
			<span class="label">Search Bookmark</span>
			<i class="line"></i>
			<div class="searchbox">
				<div class="search-list" ref="listEle">
					<span
						class="search-item"
						v-for="(bookmark, i) in search_tree"
						:class="{ active: i === index }"
						:key="bookmark.id"
						>{{ bookmark.title }}: {{ bookmark.url }}</span
					>
				</div>
			</div>
		</div>
		<!-- `<div class="searchbox">
			<div class="search-list">
				<span
					class="search-item"
					v-for="bookmark in search_tree"
					:key="bookmark.id"
					>{{ bookmark.title }}</span
				>
			</div>
		</div>` -->
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useFetch } from './composable/useFetch'
import { debounce } from '@/utils/index'
const input = ref(''),
	show = ref(false),
	isExists = ref(true)
const { search_tree, bookmark_tree, message } = useFetch(input)
const screen = ref(150 * window.devicePixelRatio)
const inputEle = ref<HTMLInputElement>()
const listEle = ref<HTMLDivElement>()
const index = ref(0)
// window.onresize = () => {
// 	screen.value = queryWindowRect()
// }
message.eventsHandler.on<{ type: 'command'; data: string }>(
	'command',
	({ data }) => {
		if (data === 'show-search-input') {
			if (isExists.value) isExists.value = false
			show.value = !show.value
			nextTick(() => {
				if (show.value) {
					inputEle.value?.focus()
				}
			})
		}
	}
)

function keypress(e: KeyboardEvent) {
	index.value =
		e.code === 'ArrowUp'
			? Math.max(0, --index.value)
			: Math.min(search_tree.value.length - 1, ++index.value)
	if (listEle.value?.children.length) {
		const target = listEle.value?.children[index.value]
		listEle.value.scroll({ top: target.offsetTop })
	}
}

function confirm() {
	message.sendMessage({
		type: 'openTab',
		data: search_tree.value[index.value],
		to: 'background'
	})
}
// function queryWindowRect() {
// 	return Math.max(document.body.offsetWidth, document.body.offsetHeight) * 2.9
// }
// function getRatio() {
// 	var ratio = 0
// 	var screen = window.screen
// 	var ua = navigator.userAgent.toLowerCase()

// 	if (window.devicePixelRatio !== undefined) {
// 		ratio = window.devicePixelRatio
// 	} else if (~ua.indexOf('msie')) {
// 		if (screen.deviceXDPI && screen.logicalXDPI) {
// 			ratio = screen.deviceXDPI / screen.logicalXDPI
// 		}
// 	} else if (
// 		window.outerWidth !== undefined &&
// 		window.innerWidth !== undefined
// 	) {
// 		ratio = window.outerWidth / window.innerWidth
// 	}

// 	if (ratio) {
// 		ratio = Math.round(ratio * 100)
// 	}
// 	return ratio
// }

function transitionEnd(e: TransitionEvent) {
	if (
		e.propertyName == 'background-color' &&
		e.pseudoElement.includes('::afte')
	) {
		isExists.value = show.value ? false : true
	}
}
</script>

<style lang="scss" scoped>
.searchbox {
	position: absolute;
	left: 0;
	// bottom: 0;
	// height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	transition: all 1s;
	background: white;
	border-radius: 5px 5px 5px 5px;
	.search-list {
		width: 100%;
		display: flex;
		color: #ffbc00;
		font-weight: bold;
		flex-direction: column;
		overflow-y: auto;
		max-height: 200px;
		.search-item {
			text-align: left;
			padding: 10px 0 10px 10px;
			transition: all 100ms;
			&.active {
				background: #1f3b34;
			}
		}
		&::-webkit-scrollbar {
			display: none; /* Chrome Safari */
		}
	}
}
.inputbox {
	position: relative;
	width: 30%;
	transition: opacity 0.3s;
	// transition-delay: 0.2s;
	opacity: 0;

	.line {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		background: #ffbc00;
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
		color: #fff9e9;
		font-size: 1em;
		letter-spacing: 0.05em;
		transition: 0.5s;
		z-index: 10;
		&:focus,
		&:valid {
			~ .label {
				color: #ffbc00;
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
	transition: background-color 500ms;
	z-index: 999;
	&::before {
		position: absolute;
		left: 0;
		bottom: 50%;
		content: '';
		border-radius: 100%;
		display: block;
		width: 1vw;
		height: 1vw;
		// text-align: center;
		transition: transform 0.3s, background-color 1s ease-out;
		background: rgba(0, 0, 0, 0);
		transform-origin: center center;
		z-index: -1;
		transform: scale(0);
	}

	&::after {
		position: absolute;
		left: 0;
		bottom: 50%;
		content: '';
		border-radius: 100%;
		display: block;
		width: 1vw;
		height: 1vw;
		transition: transform 0.7s, background-color 1s ease-out;
		// transition-delay: 0.1s;
		background: rgba(0, 0, 0, 0);
		transform-origin: center center;
		z-index: -1;
		transform: scale(0);
	}
	&.hover {
		background: rgba(0, 0, 0, 0.1);
	}
	&.hover .inputbox {
		opacity: 1;
	}
	&.hover::before,
	&.hover::after {
		background: #1f3b34;
		transform: scale(v-bind('screen'));
	}
}
</style>

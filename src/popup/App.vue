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
				@keydown.enter.prevent="confirm()"
				@blur="isFocus = false"
				@focus="isFocus = true"
				v-model="input" />
			<span class="label">Search Bookmark</span>
			<i class="line"></i>
			<div
				class="searchbox"
				:style="
					isFocus && input
						? 'opacity:1;transform:scale(1)'
						: 'opacity:0;transform:scale(0)'
				">
				<div class="search-list">
					<virtual-list
						:data="search_tree"
						:itemSize="50"
						:buffer="0.5"
						keyName="id"
						ref="listEle"
						#="{ slotScope }">
						<div
							class="search-item"
							:class="{ active: slotScope.__index === index }"
							@mouseover.stop="index = slotScope.__index"
							@mousedown.stop="confirm(slotScope.__index)">
							{{ slotScope.title }}: {{ slotScope.url }}
						</div>
					</virtual-list>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useFetch } from './composable/useFetch'
import { debounce } from '@/utils/index'
import virtualList from './components/virtual-list/vertical-virtual-list.vue'

const input = ref(''),
	show = ref(false),
	isExists = ref(true)
const { search_tree, bookmark_tree, message } = useFetch(input)
const screen = ref(150)
const inputEle = ref<HTMLInputElement>()
const listEle = ref<InstanceType<typeof virtualList>>()
const index = ref(0)
const isFocus = ref(false)

message.eventsHandler.on<{ type: 'command'; data: string }>(
	'command',
	({ data }) => {
		// console.log(bookmark_tree.value)
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

watch(search_tree, (oldVal, newVal) => {
	if (oldVal.length !== newVal.length) {
		listEle.value?.reset()
		index.value = 0
	}
})

function keypress(e: KeyboardEvent) {
	if (e.code === 'ArrowUp') {
		index.value =
			index.value === 0 ? search_tree.value.length - 1 : --index.value
	} else {
		index.value =
			index.value >= search_tree.value.length - 1 ? 0 : ++index.value
	}
	listEle.value?.container?.scrollTo({
		top: listEle.value?._data[index.value]?.__top
	})
	// console.log(listEle.value?._data[index.value]?.__top, listEle.value?._data[index.value])
}

function confirm(clickIndex?: number) {
	message.sendMessage({
		type: 'select',
		data: search_tree.value[
			(clickIndex !== undefined && !isNaN(clickIndex) && clickIndex) ||
				index.value
		],
		to: 'background'
	})
	inputEle.value?.focus()
}

function icon(url = '') {
	const domain =
		url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/i) || ''
	return `${domain[0]}/favicon.ico`
}

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
	height: 300px;
	display: flex;
	align-items: center;
	transition: opacity 0.5s, transform 0.5s;
	transform-origin: top left;
	background: rgb(240, 178, 8);
	border-radius: 0px 0px 5px 5px;
	overflow: hidden;

	.search-list {
		width: 100%;
		display: flex;
		color: white;
		font-weight: bold;
		flex-direction: column;
		transition: all 500ms;
		height: inherit;

		// &::-webkit-scrollbar {
		// 	display: none; /* Chrome Safari */
		// }
		.search-item {
			text-align: left;
			box-sizing: border-box;
			padding: 10px;
			display: block;
			// height: 50px;
			overflow: hidden;
			font-size: 14px;
			box-sizing: border-box;
			cursor: pointer;
			word-break: break-all;
			&:hover {
				background: #fecd49;
				color: white;
			}
			&.active {
				background: #fecd49;
				color: white;
			}
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
		border-radius: 4px 4px 0 0;
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
				transform: translateX(-10px) translateY(-40px);
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
	font-family: 'myfont';
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
	z-index: 99999;
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
		transform: scale(v-bind('screen'), v-bind('screen'));
	}
}
</style>

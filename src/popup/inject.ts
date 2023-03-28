import { createApp } from 'vue'
import App from './App.vue'
// import styles from './style.scss?inline'

document.addEventListener('DOMContentLoaded', function () {
	const wrapNode = document.createElement('div'),
		contentNode = document.createElement('div')
	wrapNode.id = 'bookmark-extension'

	const shadowRoot = wrapNode.attachShadow({ mode: 'closed' })
	// shadowRoot.innerHTML = `<style>${styles}</style>`
	shadowRoot.innerHTML = `<style>${__CSS_STYLE_CONTENT}</style>`
	shadowRoot.appendChild(contentNode)
	document.body.appendChild(wrapNode)
	createApp(App).mount(contentNode)
})

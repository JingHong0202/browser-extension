import { createApp } from 'vue'
import App from './App.vue'

document.addEventListener('DOMContentLoaded', function () {
  const wrapNode = document.createElement('div'),
    contentNode = document.createElement('div')
  wrapNode.id = 'bookmark-extension'
  contentNode.style = ` position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;z-index:999`
  const shadowRoot = wrapNode.attachShadow({ mode: 'open' })
  shadowRoot.append(contentNode)
  document.body.appendChild(wrapNode)
  createApp(App).mount(contentNode)
})

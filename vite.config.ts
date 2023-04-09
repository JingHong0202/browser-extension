import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import bex from 'vite-plugin-br-ext'
import { join } from 'path'

export default defineConfig(({ command, mode }) => {
	return {
		resolve: {
			alias: {
				'@': join(__dirname, 'src/')
			},
			extensions: ['.vue', '.js', '.ts']
		},
		plugins: [
			vue(),
			bex({
				mode,
				reload: {
					browser:
						'/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
				}
			})
		],
		// root: 'src',
		build: {
			rollupOptions: {
				input: 'src/manifest.json'
			}
		}
	}
})

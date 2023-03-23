import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import bex from './plugin/index'
import { join } from 'path'

export default defineConfig(({ command, mode }) => {
  return {
    resolve: {
      alias: {
        '@': join(__dirname, 'src/'),
      },
      extensions: ['.vue', '.js', '.ts'],
    },
    plugins: [
      vue(),
      bex({
        mode,
        reload: {
          browser:
            'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        },
      }),
    ],
    // root: 'src',
    build: {
      rollupOptions: {
        input: 'src/manifest.json',
      },
    },
  }
})

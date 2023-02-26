import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import bex from 'vite-plugin-br-ext';
import { join } from 'path';
import { cwd } from 'process';
import { chromeExtension } from './plugin-2';
import webExtension from 'vite-plugin-web-extension';

export default defineConfig(({ command, mode }) => {
  return {
    resolve: {
      alias: {
        '@': join(__dirname, 'src/'),
      },
      extensions: ['.vue', '.js', '.ts']
    },
    plugins: [
      // Inspect({ outputDir: '.vite-inspect' ,build: true}),
      // vueJsx({ optimize: true, transformOn: true }),
      vue(),
      // legacy({
      //   targets: ['defaults', 'not IE 11'],
      // }),
      bex(true),
      // webExtension({
      //   webExtConfig: {
      //     startUrl: ['https://google.com'],
      //      browser: process.env.TARGET,
      //     chromiumBinary:
      //       '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      //   },
      // }),
    ],
    // root: 'src',
    build: {
      rollupOptions: {
        input: "src/manifest.json"
      }
    },
  };
});

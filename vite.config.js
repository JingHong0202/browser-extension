import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import bex from './plugin/index';
import { join } from 'path';
import { cwd } from 'process';
import { chromeExtension } from "./plugin-2";


export default defineConfig(({ command, mode }) => {
  return {
    resolve: {
      alias: {
        '@': join(__dirname, 'src/'),
      },
    },
    plugins: [
      // Inspect({ outputDir: '.vite-inspect' ,build: true}),
      // vueJsx({ optimize: true, transformOn: true }),
      vue({ refTransform: true }),
      // legacy({
      //   targets: ['defaults', 'not IE 11'],
      // }),
      bex(true),
      // chromeExtension(),
    ],
    build: {
      target: "es2015",
      rollupOptions: {
        input: join(cwd(), './src/manifest.json'),
      },
    },
  };
});

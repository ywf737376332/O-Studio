import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import sass from 'sass'
import {
  name,
  description,
  version
} from "./package.json";
const __APP_INFO__ = {
  pkg: { name, description, version },
  buildTimestamp: Date.now()
};
const publicDir = resolve('resources')
const envDir = resolve('build')

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    publicDir,
    envDir,
    envPrefix: 'RENDERER_',
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    server: {
      hmr: true,
      port: 8001
    },
    plugins: [
      vue(),
      vueJsx(),
      VueSetupExtend()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          implementation: sass
        }
      }
    }
  }
})

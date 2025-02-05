import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import visualizer from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
    global: {}
  },
  plugins: [
    vue(),
    vueDevTools(),
    // visualizer({
    //   open: true, //build后，是否自动打开分析页面，默认false
    //   gzipSize: true, //是否分析gzip大小
    //   brotliSize: true, //是否分析brotli大小
    // // filename: 'stats.html'//分析文件命名
    // }),
  ],
  server: {
    proxy: {

    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

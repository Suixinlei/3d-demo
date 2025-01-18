import { defineConfig } from 'vite'
import { resolve } from 'path'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        basicGlobe: resolve(__dirname, 'src/pages/basicGlobe/index.html'),
        home: resolve(__dirname, 'src/pages/home/index.html'),
        expandGlobe: resolve(__dirname, 'src/pages/expandGlobe/index.html'),
        pointGlobe: resolve(__dirname, 'src/pages/pointGlobe/index.html'),
        raycasterTest: resolve(__dirname, 'src/pages/raycasterTest/index.html'),
        naviGlobe: resolve(__dirname, 'src/pages/naviGlobe/index.html'),
      }
    }
  },
  plugins: [glsl()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
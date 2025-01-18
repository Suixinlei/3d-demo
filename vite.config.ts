import { defineConfig } from 'vite'
import { resolve } from 'path'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['three'],
      output: {
        globals: {
          'three': 'THREE'
        }
      },
      input: {
        home: resolve(__dirname, 'src/pages/home/index.html'),
        expandGlobe: resolve(__dirname, 'src/pages/expandGlobe/index.html'),
        mapGlobe: resolve(__dirname, 'src/pages/mapGlobe/index.html'),
        planeGlobe: resolve(__dirname, 'src/pages/planeGlobe/index.html'),
        pointGlobe: resolve(__dirname, 'src/pages/pointGlobe/index.html'),
        raycasterTest: resolve(__dirname, 'src/pages/raycasterTest/index.html'),
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
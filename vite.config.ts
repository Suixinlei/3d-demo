import { defineConfig } from 'vite'  
import { resolve } from 'path'  

export default defineConfig({  
  build: {  
    rollupOptions: {  
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
  resolve: {  
    alias: {  
      '@': resolve(__dirname, 'src')  
    }  
  }  
})
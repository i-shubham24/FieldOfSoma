import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Icons are imported one file at a time to keep the bundle small. Listing them here
// lets the dev server prepare them up front, so adding one never forces a mid-session reload.
const icons = ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'CaretDown', 'Check', 'Plus', 'X']

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: icons.map((name) => `@phosphor-icons/react/dist/csr/${name}`),
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        // `motion` is a thin wrapper: its real code lives in framer-motion and motion-dom,
        // so match by path or that code lands in the main chunk instead.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules[\/](react|react-dom|react-router|react-router-dom|scheduler)[\/]/.test(id)) return 'vendor-react'
          if (/node_modules[\/](motion|framer-motion|motion-dom|motion-utils)[\/]/.test(id)) return 'vendor-motion'
          if (/node_modules[\/]lenis[\/]/.test(id)) return 'vendor-lenis'
          return undefined
        },
      },
    },
  },
})

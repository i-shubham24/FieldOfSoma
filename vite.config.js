import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Icons are imported one file at a time to keep the bundle small. Listing them here
// lets the dev server prepare them up front, so adding one never forces a mid-session reload.
const icons = ['ArrowDown', 'ArrowRight', 'CaretDown', 'Check', 'Plus']

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: icons.map((name) => `@phosphor-icons/react/dist/csr/${name}`),
  },
})

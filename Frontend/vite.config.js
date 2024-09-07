import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from 'tailwindcss';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // css: {
  //   postcss: { plugins: [tailwindcss()] },
  // },
  server: {
    proxy: {
      // Proxy /api requests to the backend server on port 10000
      '/app': {
        target: 'http://localhost:10000',
        changeOrigin: true,
     }
    }
  }
});

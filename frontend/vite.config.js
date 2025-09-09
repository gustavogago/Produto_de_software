import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
  // use a different port to avoid clashing with Django (8000)
  port: 3000,
  },
});
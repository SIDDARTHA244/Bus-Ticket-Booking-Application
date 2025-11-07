import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000", // Use 127.0.0.1 instead of localhost
        changeOrigin: true,
        secure: false, // optional, in case of HTTPS issues
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src"
    },
  },
});

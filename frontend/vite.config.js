import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api":   { target: "http://localhost:5000", changeOrigin: true },
      "/badge": { target: "http://localhost:5000", changeOrigin: true },
    },
  },

  build: {
    target: "es2020",
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manually split large dependencies into separate cacheable chunks
        manualChunks: {
          "vendor-react":  ["react", "react-dom", "react-router-dom"],
          "vendor-redux":  ["@reduxjs/toolkit", "react-redux"],
          "vendor-ui":     ["react-hot-toast"],
        },
      },
    },
  },

  // Optimize deps pre-bundling
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "@reduxjs/toolkit", "react-redux"],
  },
});

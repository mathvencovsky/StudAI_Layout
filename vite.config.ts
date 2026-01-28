import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    basicSsl(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // any path starting with /ytapi will be proxied
      "/ytapi": {
        target: "https://ytapi.apps.mattw.io",
        changeOrigin: true,
        secure: true,
        // optional: strip the /ytapi prefix before forwarding
        rewrite: (path) => path.replace(/^\/ytapi/, ""),
      },
    },
  },
});

import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sentryVitePlugin({
      org: "fpt-d1",
      project: "javascript-react",
    }),
  ],
  build: {
    sourcemap: true,
  },
  preview: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@schemas": path.resolve(__dirname, "src/schemas"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
});

import react from "@vitejs/plugin-react";
import path from "node:path";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    tanstackStart({
      srcDirectory: "app",
    }),
    react(),
    nitro(),
  ],
  assetsInclude: ["**/*.md"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});

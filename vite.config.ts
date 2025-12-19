import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), nitro()],
  assetsInclude: ["**/*.md"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});

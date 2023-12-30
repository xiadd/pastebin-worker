import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  assetsInclude: ["**/*.md"],
});

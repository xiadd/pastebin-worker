import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  preset: "cloudflare-module",
  cloudflare: {
    wrangler: {
      
    },
  },
  devServer: {
    watch: ["server/**/*"],
  },
});

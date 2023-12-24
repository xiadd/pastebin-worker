import { defineConfig } from 'vite';
import { splitVendorChunkPlugin } from 'vite';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  assetsInclude: ['**/*.md'],
});

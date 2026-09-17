import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        catalog: resolve(__dirname, "catalog.html"),
      },
    },
  },
});

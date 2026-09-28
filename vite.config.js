import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/rsschool-landing-page/",
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        catalog: resolve(__dirname, "catalog.html"),
        journal: resolve(__dirname, "journal.html"),
      },
    },
  },
});

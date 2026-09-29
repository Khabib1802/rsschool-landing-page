import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/rsschool-landing-page/",
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        catalog: resolve(import.meta.dirname, "catalog.html"),
        journal: resolve(import.meta.dirname, "journal.html"),
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        "font-awesome/css/font-awesome.min.css", // Externalize this module
        "react-quill",
        "moment",
        "dompurify",
      ],
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Three.js core into its own chunk (~700KB)
          three: ["three"],
          // React ecosystem
          "react-vendor": ["react", "react-dom"],
          // Drei + Fiber (3D helpers)
          "r3f-vendor": [
            "@react-three/fiber",
            "@react-three/drei",
            "@react-three/postprocessing",
          ],
          // GSAP animations
          gsap: ["gsap", "@gsap/react"],
        },
      },
    },
  },
});

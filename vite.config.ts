import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  // Let the official Netlify plugin handle the deploy build instead of the
  // wrapper's default Cloudflare/nitro target.
  nitro: false,
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [netlify()],
  },
});

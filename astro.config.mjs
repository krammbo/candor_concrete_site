// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Update this to the production domain before launch (used for canonical URLs + sitemap).
const SITE_URL = 'https://www.candorcrete.com';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

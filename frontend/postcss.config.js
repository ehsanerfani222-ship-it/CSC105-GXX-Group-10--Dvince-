// Tailwind v4 is wired through the @tailwindcss/vite plugin in vite.config.ts,
// so this PostCSS config only needs autoprefixer.
export default {
  plugins: {
    autoprefixer: {},
  },
};

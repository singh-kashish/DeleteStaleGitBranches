import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        muted: "var(--color-muted)",
        text: "var(--color-text)",
        primary: "var(--color-primary)",
        border: "var(--color-border)",
      },
    },
  },
  plugins: [animate],
};

export default config;

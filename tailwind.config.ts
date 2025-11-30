// tailwind.config.ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/app/components/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: [animate]
} satisfies Config;

// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
};

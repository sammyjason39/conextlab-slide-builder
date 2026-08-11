import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        slate: "#1E293B",
        blue: {
          DEFAULT: "#1652F0",
          soft: "#DCE5FE",
        },
        surface: "#FFFFFF",
        mist: "#F8FAFC",
        hairline: "#E5E7EB",
        "hairline-2": "#D1D5DB",
        muted: "#6B7280",
        "muted-2": "#9CA3AF",
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

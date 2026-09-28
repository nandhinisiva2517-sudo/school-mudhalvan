import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        spark: {
          primary: "#FF8A3D",
          secondary: "#E8447A",
          tech: "#7C5CFC",
          success: "#2FB88B",
          bg: "#FFF9F0",
          ink: "#33302B",
          "bg-card": "#FFFCF7",
          "ink-muted": "#7A7670",
          "border": "#EDE8DF",
        },
      },
      fontFamily: {
        baloo: ["Baloo 2", "cursive"],
        baloo_thambi: ["Baloo Thambi 2", "cursive"],
        figtree: ["Figtree", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "bounce-slow": "bounce 3s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 138, 61, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(255, 138, 61, 0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

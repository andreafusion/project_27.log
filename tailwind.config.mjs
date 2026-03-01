// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Brand palette
        "ms-black": "#050505",
        "ms-white": "#FFFFFF",
        "ms-red": "#FF0000",
        "ms-green": "#00FF41", // terminal OK green
        "ms-dim": "#888888",
        "ms-dark": "#0A0A0A",
        "ms-border": "rgba(255,255,255,0.07)"
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Courier New"', "monospace"]
      },
      animation: {
        "pulse-red": "pulse-red 1.4s ease-in-out infinite",
        blink: "blink 0.7s step-end infinite",
        scanline: "scanline 8s linear infinite"
      },
      keyframes: {
        "pulse-red": {
          "0%, 100%": {
            boxShadow: "0 0 6px rgba(255,0,0,0.6)",
            borderColor: "#FF0000"
          },
          "50%": {
            boxShadow: "0 0 2px rgba(255,0,0,0.1)",
            borderColor: "rgba(255,0,0,0.3)"
          }
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" }
        },
        scanline: {
          "0%": { top: "-100%" },
          "100%": { top: "100%" }
        }
      }
    }
  },
  plugins: []
};

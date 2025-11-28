import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "'Space Grotesk'", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "'Inter'", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#0f172a",
        accent: "#e50914",
        dusk: "#0b0c12",
        carbon: "#0a0b10",
        steel: "#1b1d24",
        ash: "#d9d9de"
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(229, 9, 20, 0.25), transparent 26%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.12), transparent 24%), radial-gradient(circle at 50% 80%, rgba(229, 9, 20, 0.12), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;

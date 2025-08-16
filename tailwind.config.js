/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        muted: "hsl(210 40% 96%)",
        primary: { DEFAULT: "hsl(14 90% 57%)", foreground: "#fff" },
        border: "hsl(214 32% 91%)",
        ring: "hsl(215 20% 65%)",
        card: "#fff",
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,0.06)" }
    },
  },
  plugins: [],
}

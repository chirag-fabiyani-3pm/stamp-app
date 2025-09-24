import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        stamp: {
          primary: '#8B4513',     // Rich Brown
          secondary: '#D2B48C',   // Tan
          accent: '#DAA520',      // Goldenrod
          royal: {
            50: '#FDF8F3',        // Lightest cream
            100: '#FAF0E6',       // Light cream
            200: '#F5E6D3',       // Cream
            300: '#E6D2B5',       // Light tan
            400: '#D2B48C',       // Tan
            500: '#C19A6B',       // Medium tan
            600: '#A0522D',       // Sienna
            700: '#8B4513',       // Saddle brown
            800: '#654321',       // Dark brown
            900: '#3E2723'        // Very dark brown
          },
          gold: {
            50: '#FFFEF7',
            100: '#FFF9E6',
            200: '#FFF2CC',
            300: '#FFE699',
            400: '#FFD700',       // Pure gold
            500: '#DAA520',       // Goldenrod
            600: '#B8860B',       // Dark goldenrod
            700: '#996515',       // Darker gold
            800: '#7A5C20',       // Bronze
            900: '#5B4015'        // Dark bronze
          },
          red: {
            500: '#DC143C',       // Crimson red for accents
            600: '#B91C1C',       // Darker red
            700: '#991B1B'        // Deep red
          }
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "dash": {
          to: { strokeDashoffset: "20" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "dash": "dash 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

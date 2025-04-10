import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Sky colors
    "bg-sky-50",
    "bg-sky-100",
    "text-sky-600",
    "hover:border-sky-200",

    // Cyan colors
    "bg-cyan-50",
    "bg-cyan-100",
    "text-cyan-600",
    "hover:border-cyan-200",

    // Blue colors
    "bg-blue-50",
    "bg-blue-100",
    "text-blue-600",
    "hover:border-blue-200",

    // Indigo colors
    "bg-indigo-50",
    "bg-indigo-100",
    "text-indigo-600",
    "hover:border-indigo-200",

    // Violet colors
    "bg-violet-50",
    "bg-violet-100",
    "text-violet-600",
    "hover:border-violet-200",

    // Teal colors
    "bg-teal-50",
    "bg-teal-100",
    "text-teal-600",
    "hover:border-teal-200",

    // Emerald colors
    "bg-emerald-50",
    "bg-emerald-100",
    "text-emerald-600",
    "hover:border-emerald-200",

    // Orange colors
    "bg-orange-50",
    "bg-orange-100",
    "text-orange-600",
    "hover:border-orange-200",

    // Amber colors
    "bg-amber-50",
    "bg-amber-100",
    "text-amber-600",
    "hover:border-amber-200",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config

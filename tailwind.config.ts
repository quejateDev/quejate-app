import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#E8E8E8',
        foreground: '#123159',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#123159'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#123159'
        },
        primary: {
          DEFAULT: '#3E5C84', 
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#D8E6F8',
          foreground: '#FFFFFF'
        },
        tertiary: {
          DEFAULT: '#123159',
          foreground: '#FFFFFF'
        },
        quaternary: {
          DEFAULT: '#005DD6', 
          foreground: '#FFFFFF',
          dark: '#0449a4ff', 
        },
        muted: {
          DEFAULT: '#E8E8E8',
          foreground: '#3E5C84'
        },
        accent: {
          DEFAULT: '#D8E6F8', 
          foreground: '#005DD6'
        },
        destructive: {
          DEFAULT: '#FF4D4D', 
          foreground: '#FFFFFF'
        },
        border: '#D8E6F8',
        input: '#FFFFFF',
        ring: '#005DD6',
        chart: {
          '1': '#005DD6',
          '2': '#3E5C84',
          '3': '#D8E6F8',
          '4': '#123159',
          '5': '#E8E8E8'
        },
        sidebar: {
          DEFAULT: '#123159',
          foreground: '#FFFFFF',
          primary: '#005DD6',
          'primary-foreground': '#FFFFFF',
          accent: '#D8E6F8',
          'accent-foreground': '#005DD6',
          border: '#3E5C84',
          ring: '#005DD6'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['var(--font-sora)', 'sans-serif'],
        vietnam: ['var(--font-be-vietnam-pro)', 'sans-serif']
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

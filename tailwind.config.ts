import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      colors: {
        blue: '#1C4980',
        sky: '#DFF1F1',
        gray: '#9CB0AF',
        fadeblue: '#AEC7D5',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;

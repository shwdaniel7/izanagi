/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- ADICIONE ISSO
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Izanagi (Mantida)
        gold: {
          light: '#D4B171',
          DEFAULT: '#C9A86A',
          dark: '#927849',
        },
        charcoal: {
          light: '#3A3A3C',
          DEFAULT: '#1C1C1E',
          dark: '#0D0D0D', // Vamos usar muito esse no Dark Mode
        },
        paper: '#F7F3EA',
        action: '#6A8CC9',
        success: '#4CAF50',
        error: '#E57373',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Noto Sans JP', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px', // Padrão dos cartões
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)', // Sombra realista
        'glow': '0 0 15px rgba(201, 168, 106, 0.3)', // Brilho dourado sutil
      }
    },
  },
  plugins: [],
}
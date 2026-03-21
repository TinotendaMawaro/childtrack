/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#4A90E2',
          coral: '#FF7A59',
        },
        mint: '#6EE7B7',
        accent: {
          pink: '#FF6B9D',
          yellow: '#FFD93D',
          green: '#6EE7B7',
          purple: '#A78BFA',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.7)',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'large': '28px',
      },
      boxShadow: {
        'glass': '0 8px 30px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(110, 231, 183, 0.5)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease',
        'slide-up': 'slideUp 300ms ease',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(110, 231, 183, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(110, 231, 183, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}


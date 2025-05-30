/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Rất quan trọng, phải có dòng này
  ],
  theme: {
    extend: {
      // Bạn có thể sao chép lại các cấu hình màu sắc, font, keyframes tùy chỉnh
      // từ file tailwind.config.js cũ của bạn vào đây (nếu có)
      // Ví dụ (dựa trên các file cũ của bạn):
      colors: {
        background: '#F8F5F2', // trắng ngà
        primary: '#6F4E37',     // nâu cà phê
        secondary: '#A67B5B',   // nâu sữa
        textMain: '#1F2937',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Rất quan trọng cho font chữ
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: { // Thêm phần animation này nếu bạn đã có keyframes
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideInRight: 'slideInRight 0.5s ease-out forwards',
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
};
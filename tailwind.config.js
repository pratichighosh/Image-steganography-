// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
};

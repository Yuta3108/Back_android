// tailwind.config.js
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#F8F5F2', // trắng ngà
                primary: '#6F4E37',    // nâu cà phê
                secondary: '#A67B5B',  // nâu sữa
                textMain: '#1F2937',
            },
        },
    },
    plugins: [],
}

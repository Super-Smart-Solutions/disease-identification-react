module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1E40AF',
                secondary: '#DB2777',
            },
            fontFamily: {
                arabic: ["Lina Sans", "sans-serif"],
                english: ['IBM Plex Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
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
                arabic: ["Cascadia Code", "serif"],
                english: ['Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
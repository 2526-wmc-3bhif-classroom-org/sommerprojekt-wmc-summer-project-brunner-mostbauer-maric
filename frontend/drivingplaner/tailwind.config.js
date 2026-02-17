/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'main': 'var(--main-color)',
                'main-hover': 'var(--main-color-hover)',
            },
        },
    },
    plugins: [],
}
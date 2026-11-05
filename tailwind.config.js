/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#0B2545',      // Deep Corporate Navy
                    secondary: '#061325',    // Midnight Navy Background
                    accent: '#0077C8',       // Electric Logistics Blue
                    highlight: '#38BDF8',    // Cyan Sky Glow
                    orange: '#F37021',       // Sentron Vibrant Solar Orange
                    orangeHover: '#E05D0E',  // Darker Orange for Hover
                    light: '#F8FAFC',        // Slate Light text
                    dark: '#050D1A',         // Ultra-dark background
                },
                sentron: {
                    navy: '#0B2545',
                    deep: '#061325',
                    blue: '#0077C8',
                    cyan: '#38BDF8',
                    orange: '#F37021',
                    orangeHover: '#E05D0E',
                    surface: 'rgba(11, 37, 69, 0.65)',
                    border: 'rgba(56, 189, 248, 0.18)',
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.05)',
                    border: 'rgba(255, 255, 255, 0.1)',
                    dark: 'rgba(6, 19, 37, 0.75)',
                    neon: 'rgba(0, 119, 200, 0.18)',
                    orange: 'rgba(243, 112, 33, 0.2)',
                }
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
                heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            },
            boxShadow: {
                'neon': '0 4px 24px rgba(0, 0, 0, 0.4)',
                'neon-brand': '0 4px 24px rgba(0, 119, 200, 0.3)',
                'neon-orange': '0 4px 24px rgba(243, 112, 33, 0.45)',
                'sentron-card': '0 10px 40px -10px rgba(6, 19, 37, 0.7)',
            }
        },
    },
    plugins: [],
}


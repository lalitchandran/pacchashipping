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
                    primary: '#2D6A4F',  // Green Primary
                    secondary: '#1B4332', // Dark Green Secondary
                    surface: 'rgba(255, 255, 255, 0.05)', // Glass surface
                    accent: '#2D6A4F',
                    highlight: '#40916c',
                    light: '#F5F5F7',    // Light text
                    dark: '#1D1D1F',     // Dark background
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.05)',
                    border: 'rgba(255, 255, 255, 0.1)',
                    dark: 'rgba(0, 0, 0, 0.6)',
                    neon: 'rgba(45, 106, 79, 0.15)',
                }
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
                heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            },
            boxShadow: {
                'neon': '0 4px 24px rgba(0, 0, 0, 0.3)',
                'neon-brand': '0 4px 24px rgba(45, 106, 79, 0.25)',
            }
        },
    },
    plugins: [],
}

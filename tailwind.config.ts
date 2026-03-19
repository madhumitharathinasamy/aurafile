import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1280px",
            },
        },
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                accent: "var(--accent)",
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                surface: "var(--surface)",
                text: {
                    secondary: "var(--text-secondary)",
                    muted: "var(--text-muted)",
                },
                divider: "var(--divider)",
                success: "#22c55e",
                error: "#ef4444",
            },
            borderRadius: {
                lg: "var(--radius-lg)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
            },
            boxShadow: {
                soft: "0 2px 10px rgba(0, 0, 0, 0.05)",
            },
            fontFamily: {
                sans: ["Inter", ...fontFamily.sans],
            },
        },
    },
    plugins: [],
};
export default config;

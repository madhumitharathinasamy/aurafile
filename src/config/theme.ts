export const themeConfig = {
    colors: {
        background: "#f5f5f5",  // Light gray background
        foreground: "#111111",  // Text
        primary: "#0070f3",     // New Primary Blue
        primaryForeground: "#ffffff",
        secondary: "#111111",   // Secondary
        secondaryForeground: "#ffffff",
        accent: "#ffffff",      // Accent Background
        border: "#eaeaea",      // Border
        input: "#eaeaea",       // Input Border
        surface: "#ffffff",     // Card Background (Surface)
        textSecondary: "#666666", // Secondary Text
        textMuted: "#888888",     // Muted Text
        divider: "#eaeaea",
        ring: "#0070f3",        // Focus Ring
        success: "#0070f3",
        error: "#e00000",       // Destructive Red
    },
    fonts: {
        sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        serif: "'Crimson Pro', serif",
    },
    spacing: {
        container: "1280px",
        section: "4rem",
    },
    borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.5rem", // Standardized to 0.5rem (8px)
        full: "9999px",
    },
};

export type ThemeConfig = typeof themeConfig;

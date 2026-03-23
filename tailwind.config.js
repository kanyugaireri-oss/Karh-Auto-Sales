export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                base: "#050b14",
                panel: "#0b1220",
                border: "rgba(148, 163, 184, 0.16)",
                accent: "#3b82f6",
                muted: "#94a3b8",
                whatsapp: "#16a34a"
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "Segoe UI", "sans-serif"]
            },
            boxShadow: {
                card: "0 12px 35px rgba(2, 6, 23, 0.4)"
            }
        }
    },
    plugins: []
};

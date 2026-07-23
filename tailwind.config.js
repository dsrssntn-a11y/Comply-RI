/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "cloud-white": "#F8FAFC",
        "surface-white": "#FFFFFF",
        "mist-gray": "#D8E1EA",
        "harbor-blue": "#123B66",
        "anchor-gold": "#D4A62A",
        "bay-blue": "#2F6FAB",
        "sea-glass": "#2E8B7D",
        "slate-amber": "#C98A2B",
        "deep-coral": "#B94A48",
        "fog-gray": "#5F6B7A",
      },
      fontFeatureSettings: {
        tabular: '"tnum"',
      },
    },
  },
  plugins: [],
};

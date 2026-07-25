/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "cloud-white": "#F8FAFC",
        "surface-white": "#FFFFFF",
        "mist-gray": "#D8E1EA",
        // Scoped to form control borders specifically (inputs/selects sit on
        // an identically-colored white background with no other boundary
        // cue, unlike cards which also have a shadow) — meets the 3:1 WCAG
        // 1.4.11 non-text contrast minimum; mist-gray alone measures ~1.3:1.
        "field-border": "#7389A3",
        "harbor-blue": "#123B66",
        "anchor-gold": "#D4A62A",
        "bay-blue": "#2F6FAB",
        "sea-glass": "#22685D",
        "slate-amber": "#8F5A14",
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

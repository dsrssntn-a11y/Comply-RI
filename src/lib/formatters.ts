export function formatTons(value: number): string {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)} tons`;
}

export function generateShareText(tons: number, url: string): string {
  return `[enter entity name] is taking steps to comply with Rhode Island's Commercial Food Waste Ban and reduce their environmental impact. An estimated ${tons} tons of organic waste will be diverted from landfill annually. Learn more: ${url} — powered by RhodeWaste — Organics Navigator`;
}

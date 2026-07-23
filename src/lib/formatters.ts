export function formatTons(value: number): string {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)} tons`;
}

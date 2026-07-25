import type { EntityType } from "../types";

export interface EntityDefinition {
  value: EntityType;
  statutoryTerm: string;
  definition: string;
  measuredAt: string;
  citationUrl: string;
  citationLabel: string;
  note?: string;
}

// Verbatim statutory definitions — do not paraphrase. Sourced directly from
// R.I. Gen. Laws via webserver.rilegislature.gov, verified July 2026.
export const ENTITY_DEFINITIONS: EntityDefinition[] = [
  {
    value: "other",
    statutoryTerm: '"Covered entity"',
    definition:
      "each commercial food wholesaler or distributor, industrial food manufacturer or processor, supermarket, resort or conference center, banquet hall, restaurant, religious institution, military installation, prison, corporation, hospital or other medical care institution, and casino",
    measuredAt: "Threshold is measured at the covered entity itself (R.I. Gen. Laws § 23-18.9-17(a)).",
    citationUrl: "https://webserver.rilegislature.gov/Statutes/TITLE23/23-18.9/23-18.9-7.htm",
    citationLabel: "R.I. Gen. Laws § 23-18.9-7(19)",
    note:
      "This is a specific, enumerated list — not a general catch-all for every municipal or institutional entity. A general municipal office building, for example, isn't explicitly listed; whether \"corporation\" includes a municipal corporation isn't settled by the statute's text. If your organization doesn't clearly fit one of the listed categories, confirm your status directly with RIDEM.",
  },
  {
    value: "higher_ed",
    statutoryTerm: '"Covered educational institution"',
    definition: "a higher educational or research institution",
    measuredAt:
      'Threshold is measured per "covered educational facility" — a building or group of two or more interconnected buildings — not the institution\'s total campus-wide waste (R.I. Gen. Laws § 23-18.9-17(b); § 23-18.9-7(21)). See "Important things to know" for what this means for multi-building campuses.',
    citationUrl: "https://webserver.rilegislature.gov/Statutes/TITLE23/23-18.9/23-18.9-7.htm",
    citationLabel: "R.I. Gen. Laws § 23-18.9-7(20)–(21)",
  },
  {
    value: "k12",
    statutoryTerm: '"Educational entity"',
    definition:
      "all Rhode Island school districts, including a single school district, regional school district, multiple school districts, any public or private school grades kindergarten through twelve (K–12), any charter public school, or any career and technical high school",
    measuredAt: "Threshold is measured at the educational entity itself (R.I. Gen. Laws § 23-18.9-17(d)).",
    citationUrl: "https://webserver.rilegislature.gov/Statutes/TITLE16/16-111/16-111-1.htm",
    citationLabel: "R.I. Gen. Laws § 16-111-1(1)",
  },
];

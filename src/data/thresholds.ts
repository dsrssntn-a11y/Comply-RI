import type { EntityType } from "../types";

// R.I. Gen. Laws § 23-18.9-17 — annual tonnage thresholds by entity type.
export const ENTITY_THRESHOLDS: Record<EntityType, number> = {
  higher_ed: 52,
  k12: 30,
  other: 104,
};

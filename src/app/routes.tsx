import type { TabId } from "../types";

export interface TabDefinition {
  id: TabId;
  label: string;
}

export const TABS: TabDefinition[] = [
  { id: "calculator", label: "Calculator" },
  { id: "haulers", label: "Hauler Directory" },
];

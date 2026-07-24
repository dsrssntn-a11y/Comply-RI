import type { ComplianceStatus } from "../types";

const STATUS_CONFIG: Record<ComplianceStatus, { label: string; className: string }> = {
  below: {
    label: "Below Threshold",
    className: "bg-fog-gray/12 text-fog-gray",
  },
  comply: {
    label: "Above Threshold — Facility Available",
    className: "bg-slate-amber/15 text-slate-amber",
  },
  exempt: {
    label: "Above Threshold — No Facility Within 15 Miles",
    className: "bg-sea-glass/15 text-sea-glass",
  },
};

interface ThresholdBadgeProps {
  status: ComplianceStatus;
}

export default function ThresholdBadge({ status }: ThresholdBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

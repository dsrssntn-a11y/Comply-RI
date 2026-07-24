import { formatTons } from "../lib/formatters";

interface ImpactCalloutProps {
  tonnage: number;
}

export default function ImpactCallout({ tonnage }: ImpactCalloutProps) {
  return (
    <div className="text-center py-1">
      <p className="text-4xl sm:text-5xl font-bold text-harbor-blue tabular-nums">
        {formatTons(tonnage)}
      </p>
      <p className="text-sm text-fog-gray mt-1 max-w-sm mx-auto">
        If this entity complies with the RI food waste ban, an estimated {formatTons(tonnage)} of
        organic waste will be diverted from landfill annually.
      </p>
    </div>
  );
}

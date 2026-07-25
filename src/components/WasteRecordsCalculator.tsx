import { useEffect, useState } from "react";
import { sumWasteRecordsToTons } from "../lib/calculations";
import type { WasteRecord, WeightUnit } from "../types";

interface WasteRecordsCalculatorProps {
  onTotalChange: (tons: number) => void;
}

let nextRecordId = 0;
function createRecord(): WasteRecord {
  nextRecordId += 1;
  return { id: `record-${nextRecordId}`, weight: "", unit: "lbs" };
}

export default function WasteRecordsCalculator({ onTotalChange }: WasteRecordsCalculatorProps) {
  const [records, setRecords] = useState<WasteRecord[]>(() => [createRecord()]);
  const total = sumWasteRecordsToTons(records);

  // onTotalChange isn't in the deps array on purpose: the parent recreates it on
  // every render, and including it would loop. Recomputing whenever `records`
  // changes (including on mount) is what we actually want here.
  useEffect(() => {
    onTotalChange(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  function updateRecord(id: string, patch: Partial<WasteRecord>) {
    setRecords((prev) => prev.map((record) => (record.id === id ? { ...record, ...patch } : record)));
  }

  function removeRecord(id: string) {
    setRecords((prev) => (prev.length > 1 ? prev.filter((record) => record.id !== id) : prev));
  }

  return (
    <div className="rounded-xl border border-mist-gray bg-cloud-white p-3 space-y-2">
      <p className="text-xs font-semibold text-harbor-blue uppercase tracking-wide">
        Waste tracking records
      </p>
      <p className="text-xs text-fog-gray">
        Add every weight recorded over the year. Pounds are converted to tons automatically
        (2,000 lbs = 1 ton) and summed into your annual total.
      </p>

      <div className="space-y-2">
        {records.map((record, index) => (
          <div key={record.id} className="flex items-center gap-2">
            <span className="text-xs text-fog-gray w-4 shrink-0">{index + 1}.</span>
            <input
              type="number"
              inputMode="decimal"
              value={record.weight}
              onChange={(e) => updateRecord(record.id, { weight: e.target.value })}
              placeholder="Weight"
              aria-label={`Record ${index + 1} weight`}
              className="flex-1 min-w-0 rounded-lg border border-field-border bg-surface-white px-2.5 py-1.5 text-sm text-harbor-blue focus:outline-none focus:ring-2 focus:ring-bay-blue/40"
            />
            <select
              value={record.unit}
              onChange={(e) => updateRecord(record.id, { unit: e.target.value as WeightUnit })}
              aria-label={`Record ${index + 1} unit`}
              className="rounded-lg border border-field-border bg-surface-white px-2 py-1.5 text-sm text-harbor-blue focus:outline-none focus:ring-2 focus:ring-bay-blue/40"
            >
              <option value="lbs">lbs</option>
              <option value="tons">tons</option>
            </select>
            <button
              type="button"
              onClick={() => removeRecord(record.id)}
              disabled={records.length === 1}
              aria-label={`Remove record ${index + 1}`}
              className="text-fog-gray hover:text-deep-coral disabled:opacity-30 disabled:cursor-not-allowed text-base leading-none px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRecords((prev) => [...prev, createRecord()])}
        className="text-xs text-bay-blue hover:text-harbor-blue underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
      >
        + Add another record
      </button>

      <p className="text-sm text-harbor-blue tabular-nums pt-2 border-t border-mist-gray">
        Total: <span className="font-semibold">{total.toFixed(2)} tons</span> from {records.length}{" "}
        record{records.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}

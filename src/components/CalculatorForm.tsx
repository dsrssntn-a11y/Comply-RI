import { useState } from "react";
import SelectField from "./SelectField";
import InputField from "./InputField";
import Disclaimer from "./Disclaimer";
import ResultCard from "./ResultCard";
import WasteRecordsCalculator from "./WasteRecordsCalculator";
import { ENTITY_TYPE_OPTIONS } from "../lib/constants";
import { useFoodWasteCalculator } from "../hooks/useFoodWasteCalculator";

type TonnageMode = "direct" | "records";

export default function CalculatorForm() {
  const { values, errors, submitted, setField, handleSubmit } = useFoodWasteCalculator();
  const [tonnageMode, setTonnageMode] = useState<TonnageMode>("direct");

  return (
    <div>
      <h2 className="sr-only">Compliance Calculator</h2>
      <div className="max-w-[640px] mx-auto bg-surface-white border border-mist-gray rounded-xl shadow-sm p-6 space-y-5">
        <SelectField
          id="entity-type"
          label="Entity type"
          helperText="Choose the category that best describes your organization."
          error={errors.entityType}
          value={values.entityType}
          options={ENTITY_TYPE_OPTIONS}
          placeholder="Select entity type"
          onChange={(value) => setField("entityType", value as typeof values.entityType)}
        />

        <InputField
          id="zip-code"
          label="Zip code"
          helperText="Rhode Island zip codes only (02800–02940)."
          error={errors.zip}
          value={values.zip}
          onChange={(value) => setField("zip", value)}
          type="text"
          inputMode="numeric"
          placeholder="02886"
        />

        <div>
          <InputField
            id="tonnage"
            label="Annual food waste tonnage"
            helperText={
              tonnageMode === "direct"
                ? "Your best estimate of total food waste generated per year, in tons."
                : "Calculated automatically from the waste tracking records below."
            }
            error={errors.tonnage}
            value={values.tonnage}
            onChange={(value) => setField("tonnage", value)}
            type="number"
            inputMode="decimal"
            placeholder="65"
            disabled={tonnageMode === "records"}
          />

          <button
            type="button"
            onClick={() => setTonnageMode((mode) => (mode === "direct" ? "records" : "direct"))}
            className="mt-1.5 text-xs text-bay-blue hover:text-harbor-blue underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
          >
            {tonnageMode === "direct"
              ? "Don't know your annual total? Calculate it from waste tracking records"
              : "Enter total tonnage directly instead"}
          </button>

          {tonnageMode === "records" ? (
            <div className="mt-2">
              <WasteRecordsCalculator
                onTotalChange={(tons) => setField("tonnage", tons.toFixed(2))}
              />
            </div>
          ) : null}
        </div>

        <Disclaimer variant="entry" />

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-xl bg-anchor-gold text-harbor-blue font-semibold py-3 text-[15px] hover:brightness-95 transition-[filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor-blue/60 focus-visible:ring-offset-2"
        >
          Calculate
        </button>
      </div>

      {submitted ? <ResultCard submitted={submitted} /> : null}
    </div>
  );
}

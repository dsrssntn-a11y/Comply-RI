import { useState } from "react";
import SelectField from "./SelectField";
import InputField from "./InputField";
import Disclaimer from "./Disclaimer";
import ResultCard from "./ResultCard";
import WasteRecordsCalculator from "./WasteRecordsCalculator";
import { STATUS_LABELS } from "./ThresholdBadge";
import { ENTITY_TYPE_OPTIONS } from "../lib/constants";
import { formatTons } from "../lib/formatters";
import { useFoodWasteCalculator } from "../hooks/useFoodWasteCalculator";

type TonnageMode = "direct" | "records";

interface CalculatorFormProps {
  onNavigateToHaulers: () => void;
  onOpenHowItWorks: () => void;
}

export default function CalculatorForm({
  onNavigateToHaulers,
  onOpenHowItWorks,
}: CalculatorFormProps) {
  const { values, errors, submitted, isGeocoding, setField, handleSubmit } =
    useFoodWasteCalculator();
  const [tonnageMode, setTonnageMode] = useState<TonnageMode>("direct");
  const [addressMode, setAddressMode] = useState(false);

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

        <div>
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

          <button
            type="button"
            onClick={() => setAddressMode((mode) => !mode)}
            className="mt-1.5 text-xs text-bay-blue hover:text-harbor-blue underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bay-blue/50 rounded"
          >
            {addressMode
              ? "Use zip code only instead"
              : "Want a more precise result? Enter your exact address"}
          </button>

          {addressMode ? (
            <div className="mt-2 space-y-3 rounded-xl border border-mist-gray bg-cloud-white p-3">
              <InputField
                id="street-address"
                label="Street address"
                error={errors.streetAddress}
                value={values.streetAddress}
                onChange={(value) => setField("streetAddress", value)}
                type="text"
                placeholder="289 Scituate Ave"
              />
              <InputField
                id="city"
                label="City or town"
                error={errors.city}
                value={values.city}
                onChange={(value) => setField("city", value)}
                type="text"
                placeholder="Johnston"
              />
              <p className="text-xs text-fog-gray">
                This address is sent to OpenStreetMap's free public geocoding service to find its
                coordinates — it is not stored by this tool.
              </p>
            </div>
          ) : null}
        </div>

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
          onClick={() => handleSubmit(addressMode)}
          disabled={isGeocoding}
          className="w-full rounded-xl bg-anchor-gold text-harbor-blue font-semibold py-3 text-[15px] hover:brightness-95 transition-[filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor-blue/60 focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGeocoding ? "Looking up address…" : "Calculate"}
        </button>
      </div>

      {/* Persistent live region — kept in the DOM at all times so screen
          readers reliably announce it when a result appears, rather than
          relying on a live region that's itself newly mounted. */}
      <div aria-live="polite" role="status" className="sr-only">
        {isGeocoding
          ? "Looking up address…"
          : submitted
            ? `Result: ${STATUS_LABELS[submitted.complianceStatus]}. ${formatTons(
                submitted.tonnage
              )} entered against a ${formatTons(submitted.threshold)} threshold.`
            : ""}
      </div>

      {submitted ? (
        <ResultCard
          submitted={submitted}
          onNavigateToHaulers={onNavigateToHaulers}
          onOpenHowItWorks={onOpenHowItWorks}
        />
      ) : null}
    </div>
  );
}

import SelectField from "./SelectField";
import InputField from "./InputField";
import Disclaimer from "./Disclaimer";
import ResultCard from "./ResultCard";
import { ENTITY_TYPE_OPTIONS } from "../lib/constants";
import { useFoodWasteCalculator } from "../hooks/useFoodWasteCalculator";

export default function CalculatorForm() {
  const { values, errors, submitted, setField, handleSubmit } = useFoodWasteCalculator();

  return (
    <div>
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

        <InputField
          id="tonnage"
          label="Annual food waste tonnage"
          helperText="Your best estimate of total food waste generated per year, in tons."
          error={errors.tonnage}
          value={values.tonnage}
          onChange={(value) => setField("tonnage", value)}
          type="number"
          inputMode="decimal"
          placeholder="65"
        />

        <Disclaimer variant="entry" />

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-xl bg-anchor-gold text-harbor-blue font-semibold py-3 text-[15px] hover:brightness-95 transition-[filter]"
        >
          Calculate
        </button>
      </div>

      {submitted ? <ResultCard submitted={submitted} /> : null}
    </div>
  );
}

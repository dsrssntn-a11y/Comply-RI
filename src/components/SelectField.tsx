interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function SelectField({
  id,
  label,
  helperText,
  error,
  value,
  options,
  placeholder,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-harbor-blue mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={`w-full rounded-xl border bg-surface-white px-3.5 py-2.5 text-[15px] text-harbor-blue focus:outline-none focus:ring-2 focus:ring-bay-blue/40 ${
          error ? "border-deep-coral" : "border-mist-gray"
        }`}
      >
        <option value="" disabled>
          {placeholder ?? "Select…"}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-deep-coral">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="mt-1 text-xs text-fog-gray">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal";
  disabled?: boolean;
}

export default function InputField({
  id,
  label,
  helperText,
  error,
  value,
  onChange,
  type = "text",
  placeholder,
  inputMode,
  disabled,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-harbor-blue mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-[15px] text-harbor-blue placeholder:text-fog-gray/60 focus:outline-none focus:ring-2 focus:ring-bay-blue/40 ${
          disabled ? "bg-cloud-white text-fog-gray cursor-not-allowed" : "bg-surface-white"
        } ${error ? "border-deep-coral" : "border-field-border"}`}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-deep-coral">
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

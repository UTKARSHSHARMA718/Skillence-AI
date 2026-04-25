import { FieldError } from "react-hook-form";

type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  label?: string;
  options: Option[];
  value?: string | number;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: FieldError | string; // 👈 new prop
};

export function Select({
  label,
  options,
  value,
  placeholder = "Select an option",
  onChange,
  className = "",
  disabled = false,
  error,
}: SelectProps) {
  return (
    <div className={className}>
      {label && <label className="block mb-1 font-medium">{label}</label>}

      <select
        className={`w-full border rounded px-3 py-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
        }`}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option
            className="text-black"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {typeof error === "string" ? error : error?.message}
        </p>
      )}
    </div>
  );
}

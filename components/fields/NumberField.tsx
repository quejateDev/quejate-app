import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface NumberFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  min,
  max,
  step = 1,
}: NumberFieldProps) {
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setError("");

    // Allow empty value if not required
    if (!newValue && !required) {
      onChange("");
      return;
    }

    const numValue = Number(newValue);

    // Validate number
    if (isNaN(numValue)) {
      setError("Por favor ingrese un número válido");
      return;
    }

    // Check min/max constraints
    if (min !== undefined && numValue < min) {
      setError(`El valor mínimo es ${min}`);
      return;
    }
    if (max !== undefined && numValue > max) {
      setError(`El valor máximo es ${max}`);
      return;
    }

    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        min={min}
        max={max}
        step={step}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

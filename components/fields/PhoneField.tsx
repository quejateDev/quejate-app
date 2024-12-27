import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { useState } from "react";

interface PhoneFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function PhoneField({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
}: PhoneFieldProps) {
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Only allow numbers and some special characters
    if (!/^[0-9+\-\s]*$/.test(newValue)) {
      setError("Solo se permiten números y los caracteres + -");
      return;
    }

    // Clear error if valid
    setError("");
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
          className={`pl-8 ${error ? "border-red-500" : ""}`}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

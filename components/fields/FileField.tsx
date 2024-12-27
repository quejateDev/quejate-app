import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FileFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  accept?: string;
  maxSize?: number; // in MB
}

export function FileField({
  id,
  label,
  placeholder,
  onChange,
  required = false,
  accept = "image/*,application/pdf",
  maxSize = 5, // 5MB default
}: FileFieldProps) {
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) {
      setFileName("");
      onChange("");
      return;
    }

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      setError(`El archivo no debe superar los ${maxSize}MB`);
      e.target.value = "";
      setFileName("");
      onChange("");
      return;
    }

    // Convert to base64 for preview/storage
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      onChange(base64String);
      setFileName(file.name);
    };
    reader.onerror = () => {
      setError("Error al leer el archivo");
      setFileName("");
      onChange("");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        required={required}
        className={error ? "border-red-500" : ""}
      />
      {fileName && <p className="text-sm text-gray-500">Archivo seleccionado: {fileName}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

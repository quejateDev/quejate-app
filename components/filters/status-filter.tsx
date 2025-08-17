"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filterStatusOptions } from "@/constants/pqrMaps";

interface StatusFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function StatusFilter({ value, onValueChange }: StatusFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full md:w-[200px]">
        <SelectValue placeholder="Filtrar por estado" />
      </SelectTrigger>
      <SelectContent>
        {filterStatusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

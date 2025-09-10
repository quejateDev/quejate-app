'use client';

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoData {
  name: string;
  phone: string;
}

interface PersonalInfoSectionProps {
  data: PersonalInfoData;
  onChange: (field: keyof PersonalInfoData, value: string) => void;
  disabled?: boolean;
}

export function PersonalInfoSection({ 
  data, 
  onChange, 
  disabled = false 
}: PersonalInfoSectionProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof PersonalInfoData, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo *</Label>
        <Input
          id="name"
          name="name"
          value={data.name}
          onChange={handleInputChange}
          placeholder="Ingresa tu nombre"
          className="border-muted"
          disabled={disabled}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Número de celular</Label>
        <Input
          id="phone"
          name="phone"
          value={data.phone}
          onChange={handleInputChange}
          placeholder="+57"
          className="border-muted"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

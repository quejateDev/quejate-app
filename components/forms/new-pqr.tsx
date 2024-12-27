"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { getDepartmentsService } from "@/services/api/Department.service";
import { Department, PQRSType, User, CustomField } from "@prisma/client";
import { useEffect, useState } from "react";
import { TextField } from "../fields/TextField";
import { TextAreaField } from "../fields/TextAreaField";
import { PhoneField } from "../fields/PhoneField";
import { EmailField } from "../fields/EmailField";
import { FileField } from "../fields/FileField";
import { NumberField } from "../fields/NumberField";
import { createPQRS } from "@/services/api/pqr.service";

type CustomFieldValue = {
  name: string;
  value: string;
  type: string;
  placeholder: string;
  required: boolean;
};

type PQRSForm = {
  type: PQRSType;
  departmentId: Department["id"];
  creatorId: User["id"];
  dueDate: Date;
  customFields: CustomFieldValue[];
  isAnonymous: boolean;
};

export function NewPQRForm() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [pqr, setPqr] = useState<PQRSForm>({
    type: "PETITION",
    departmentId: "",
    creatorId: "9111e543-2225-4865-af16-b477cbc26f02",
    dueDate: new Date(),
    customFields: [],
    isAnonymous: false,
  });

  async function fetchDepartments() {
    try {
      const response = await getDepartmentsService();
      setDepartments(response);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al cargar los departamentos",
        variant: "destructive",
      });
    }
  }

  async function fetchCustomFields(departmentId: string) {
    try {
      const response = await fetch(`/api/area/${departmentId}/pqr-config`);
      const data = await response.json();
      setCustomFields(data?.customFields || []);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al cargar los campos personalizados",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (pqr.departmentId) {
      fetchCustomFields(pqr.departmentId);
    }
  }, [pqr.departmentId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPqr((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (name: string, value: string) => {
    setPqr((prev) => {
      const updatedFields = prev.customFields.map((field) =>
        field.name === name ? { ...field, value } : field
      );
      
      if (!updatedFields.some((field) => field.name === name)) {
        const fieldConfig = customFields.find((cf) => cf.name === name);
        if (fieldConfig) {
          updatedFields.push({
            name,
            value,
            type: fieldConfig.type,
            placeholder: fieldConfig.placeholder || "",
            required: fieldConfig.required || false,
          });
        }
      }
      
      return { ...prev, customFields: updatedFields };
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const { customFields: customFieldValues, ...pqrData } = pqr;

        console.log("pqrData", pqr);

      // // First create the PQRS
      const response = await createPQRS({
        ...pqrData,
        customFields: customFieldValues,
      });

      // if (response) {
        toast({
          title: "PQR creado",
          description: "El PQR ha sido creado exitosamente",
        });
      // }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al crear el PQR",
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envía tu PQRS</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              onValueChange={(value) =>
                setPqr((prev) => ({ ...prev, type: value as PQRSType }))
              }
              value={pqr.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PETITION">Petición</SelectItem>
                <SelectItem value="COMPLAINT">Queja</SelectItem>
                <SelectItem value="CLAIM">Reclamo</SelectItem>
                <SelectItem value="SUGGESTION">Sugerencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Select
              onValueChange={(value) => {
                setPqr((prev) => ({ ...prev, departmentId: value }));
                fetchCustomFields(value);
              }}
              value={pqr.departmentId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

         {customFields.map((field) => {
           const commonProps = {
             id: field.name,
             label: field.name,
             placeholder: field.placeholder || "",
             value: pqr.customFields.find((cf) => cf.name === field.name)?.value || "",
             onChange: (value: string) => handleCustomFieldChange(field.name, value),
             required: field.required
           };
         
           switch (field.type) {
             case "text":
               return <TextField key={field.name} {...commonProps} />;
             case "textarea":
               return <TextAreaField key={field.name} {...commonProps} />;
             case "phone":
               return <PhoneField key={field.name} {...commonProps} />;
             case "email":
               return <EmailField key={field.name} {...commonProps} />;
             case "file":
               return <FileField key={field.name} {...commonProps} accept="image/*,application/pdf" maxSize={5} />;
             case "number":
               return <NumberField key={field.name} {...commonProps} />;
             default:
               return <TextField key={field.name} {...commonProps} />;
           }
         })}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAnonymous"
              checked={pqr.isAnonymous}
              onCheckedChange={(checked) => 
                setPqr((prev) => ({ ...prev, isAnonymous: checked as boolean }))
              }
            />
            <Label htmlFor="isAnonymous">Hacer PQR anónima</Label>
          </div>

          <Button type="submit" className="w-full">
            Enviar PQRS
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

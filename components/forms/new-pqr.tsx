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
import { Entity, Department, PQRSType, User, CustomField } from "@prisma/client";
import { useEffect, useState } from "react";
import { TextField } from "../fields/TextField";
import { TextAreaField } from "../fields/TextAreaField";
import { PhoneField } from "../fields/PhoneField";
import { EmailField } from "../fields/EmailField";
import { FileField } from "../fields/FileField";
import { NumberField } from "../fields/NumberField";
import { createPQRS } from "@/services/api/pqr.service";
import { getEntities } from "@/services/api/entity.service";
import useAuthStore from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

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

type NewPQRFormProps = {
  entityId: string;
};

export function NewPQRForm({ entityId }: NewPQRFormProps) {
  const { user } = useAuthStore();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [pqr, setPqr] = useState<PQRSForm>({
    type: "PETITION",
    departmentId: "",
    creatorId: user?.id || "",
    dueDate: new Date(),
    customFields: [],
    isAnonymous: false,
  });
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  useEffect(() => {
    if (user) {
      setPqr((prev) => ({ ...prev, creatorId: user?.id || "" }));
    }
  }, [user]);

  async function fetchEntities() {
    try {
      const response = await getEntities();
      setEntities(response);
      setSelectedEntityId(entityId);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al cargar las entidades",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInitial(false);
    }
  }

  useEffect(() => {
    fetchEntities();
  }, []);

  useEffect(() => {
    if (selectedEntityId) {
      fetchDepartments();
    } else {
      setDepartments([]);
    }
  }, [selectedEntityId]);

  async function fetchDepartments() {
      try {
      const response = await getDepartmentsService();
      // Filter departments by selected entity
      const filteredDepartments = selectedEntityId
        ? response.filter((dept) => dept.entityId === selectedEntityId)
        : [];
      setDepartments(filteredDepartments);
      
      // Clear department selection when entity changes
      if (pqr.departmentId && !filteredDepartments.find(d => d.id === pqr.departmentId)) {
        setPqr(prev => ({ ...prev, departmentId: "" }));
      }
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

      // Initialize all custom fields with empty values
      setPqr((prev) => ({
        ...prev,
        customFields: (data?.customFields || []).map((field: CustomField) => ({
          name: field.name,
          value: "",
          type: field.type,
          placeholder: field.placeholder || "",
          required: field.required || false,
        })),
      }));
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
    if (pqr.departmentId) {
      fetchCustomFields(pqr.departmentId);
    }
  }, [pqr.departmentId]);

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
    setIsLoading(true);

    try {
      const { customFields: customFieldValues, ...pqrData } = pqr;

      // // First create the PQRS
      const response = await createPQRS({
        ...pqrData,
        customFields: customFieldValues,
      });

      if (response) {
        toast({
          title: "PQR creado",
          description: "El PQR ha sido creado exitosamente",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al crear el PQR",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingInitial) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envía tu PQRS</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Tipo de Solicitud</Label>
              <Select
                value={pqr.type}
                onValueChange={(value: PQRSType) =>
                  setPqr((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de solicitud" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PETITION">Petición</SelectItem>
                  <SelectItem value="COMPLAINT">Queja</SelectItem>
                  <SelectItem value="CLAIM">Reclamo</SelectItem>
                  <SelectItem value="SUGGESTION">Sugerencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Entidad</Label>
              <Select
                value={selectedEntityId}
                onValueChange={(value: string) => setSelectedEntityId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una entidad" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Área</Label>
              <Select
                value={pqr.departmentId}
                onValueChange={(value: string) =>
                  setPqr((prev) => ({ ...prev, departmentId: value }))
                }
                disabled={!selectedEntityId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un área" />
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
                value:
                  pqr.customFields.find((cf) => cf.name === field.name)?.value ||
                  "",
                onChange: (value: string) =>
                  handleCustomFieldChange(field.name, value),
                required: field.required,
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
                  return (
                    <FileField
                      key={field.name}
                      {...commonProps}
                      accept="image/*,application/pdf"
                      maxSize={5}
                    />
                  );
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

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar PQRS'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
